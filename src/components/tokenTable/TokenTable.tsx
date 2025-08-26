import React, { useState, useCallback, useRef, useEffect, useContext } from "react";
import { FixedSizeList } from "react-window";
import type { FixedSizeListProps } from "react-window";
import type { TokenData } from "../../types/scanner.ts";

import { COLUMN_WIDTHS, ROW_HEIGHT, sortableHeaders, TOTAL_TABLE_WIDTH, type SortConfig } from "./utils.tsx";

import Row from "./Row.tsx";
import SortableHeader from "./SortableHeader.tsx";

interface TokenTableProps {
  tokens: TokenData[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  sort: SortConfig | null;
  onSort: (key: string, direction: 'asc' | 'desc') => void;
  totalRows: number;
}

const VirtualTableContext = React.createContext<{
  top: number;
  setTop: (top: number) => void;
  header: React.ReactNode;
  footer: React.ReactNode;
}>({
  top: 0,
  setTop: (_value: number) => {},
  header: <></>,
  footer: <></>,
});

function VirtualTable({
  row,
  header,
  footer,
  ...rest
}: {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  row: FixedSizeListProps['children'];
} & Omit<FixedSizeListProps, 'children' | 'innerElementType'>) {
  const listRef = useRef<FixedSizeList | null>(null);
  const [top, setTop] = useState(0);

  return (
    <VirtualTableContext.Provider value={{ top, setTop, header, footer }}>
      <FixedSizeList
        {...rest}
        innerElementType={Inner}
        onItemsRendered={props => {
          const style =
            listRef.current &&
            // @ts-ignore private method access
            listRef.current._getItemStyle(props.overscanStartIndex);
          const top = style && style.top

          // TODO ductape
          if (top) {
            setTop(top == ROW_HEIGHT ? 0 : top);
          }

          rest.onItemsRendered && rest.onItemsRendered(props);
        }}
        ref={el => {
          listRef.current = el;
        }}
      >
        {row}
      </FixedSizeList>
    </VirtualTableContext.Provider>
  );
}

const Inner = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>(
  function Inner({ children, ...rest }, ref) {
    const { header, footer, top } = useContext(VirtualTableContext);

    return (
      <div {...rest} ref={ref}>
        <table style={{ 
          top, 
          position: 'absolute', 
          width: TOTAL_TABLE_WIDTH,
          tableLayout: 'fixed'
        }}>
          {header}
          <tbody>{children}</tbody>
          {footer}
        </table>
      </div>
    );
  }
);

const TokenTable = ({ tokens, sort, onSort, isLoading, isLoadingMore, hasMore, onLoadMore, totalRows }: TokenTableProps) => {
  const [listHeight, setListHeight] = useState(600);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback(({ scrollOffset, scrollUpdateWasRequested }: any) => {
    if (scrollUpdateWasRequested) return;
    
    const threshold = 100; // pixels from bottom
    const maxScrollOffset = tokens.length * ROW_HEIGHT - listHeight;
    
    if (scrollOffset >= maxScrollOffset - threshold && hasMore && !isLoadingMore) {
      onLoadMore();
    }
  }, [tokens.length, listHeight, hasMore, isLoadingMore, onLoadMore]);

  useEffect(() => {
    const updateHeight = () => {
      if (tableContainerRef.current) {
        const container = tableContainerRef.current;
        const rect = container.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const tableTop = rect.top;

        const availableHeight = viewportHeight - tableTop;

        setListHeight(Math.max(400, availableHeight));
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    const resizeObserver = new ResizeObserver(updateHeight);
    if (tableContainerRef.current) {
      resizeObserver.observe(tableContainerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateHeight);
      resizeObserver.disconnect();
    };
  }, [tokens.length]);

  const renderRow = useCallback(({ index }: { index: number }) => {
    const token = tokens[index];

    return (
      <Row key={token?.tokenSymbol} index={index} token={token} />
    );
  }, [tokens]);

  const tableHeader = (
    <thead className="bg-dex-secondary sticky top-0 z-10">
      <tr className="text-left text-dex-text">
        {sortableHeaders.map(({ label, sortKey, width }, index) => (
          <SortableHeader
            key={index}
            label={label}
            sortKey={sortKey}
            currentSort={sort}
            onSort={onSort}
            width={width}
          />
        ))}
        <th className="px-6 py-3 font-medium text-dex-text" style={{ 
          width: COLUMN_WIDTHS.audit,
          minWidth: COLUMN_WIDTHS.audit,
          maxWidth: COLUMN_WIDTHS.audit,
          overflow: 'hidden'
        }}>
          Audit
        </th>
        <th className="px-6 py-3 font-medium text-dex-text" style={{
          width: COLUMN_WIDTHS.social,
          minWidth: COLUMN_WIDTHS.social,
          maxWidth: COLUMN_WIDTHS.social,
          overflow: 'hidden'
        }}>
          Social
        </th>
      </tr>
    </thead>
  );

  const tableFooter = isLoadingMore ? (
    <tfoot>
      <tr>
        <td colSpan={14} className="px-6 py-4 text-center text-dex-text">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-dex-text border-t-transparent rounded-full animate-spin" />
            <span>Loading more tokens...</span>
          </div>
        </td>
      </tr>
    </tfoot>
  ) : undefined;

  return (
    <div className="flex-1 overflow-hidden" ref={tableContainerRef}>
      {tokens.length > 0 ? (
        <VirtualTable
          height={listHeight}
          width="100%"
          itemCount={totalRows}
          itemSize={ROW_HEIGHT}
          header={tableHeader}
          footer={tableFooter}
          row={renderRow}
          onScroll={handleScroll}
          overscanCount={9}
        />
      ) : (
        <div className="flex items-center justify-center h-32 text-dex-text">
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-dex-text border-t-transparent rounded-full animate-spin" />
              <span>Loading tokens...</span>
            </div>
          ) : (
            <span>No tokens found</span>
          )}
        </div>
      )}
    </div>
  );
}

export default TokenTable
