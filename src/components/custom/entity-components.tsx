import {
  ArrowLeftIcon,
  ArrowRightIcon,
  MoreVerticalIcon,
  PackageOpenIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
  TriangleAlertIcon,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, useEffect, useRef } from "react";
import { Button } from "../ui/button";
import { ButtonGroup, ButtonGroupSeparator } from "../ui/button-group";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { Kbd, KbdGroup } from "../ui/kbd";
import { TooltipWrapper } from "./tooltip-wrapper";
import { Spinner } from "../ui/spinner";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "../ui/empty";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardTitle } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type EntityHeaderProps = {
  title: string;
  description?: string;
  newButtonLabel: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { onNew?: never; newButtonHref?: never }
);

export const EntityHeader = ({
  description,
  disabled,
  isCreating,
  newButtonLabel,
  title,
  newButtonHref,
  onNew,
}: EntityHeaderProps) => {
  return (
    <div className="flex flex-row items-center justify-between gap-x-4">
      <div className="flex flex-col">
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
        {description && (
          <p className="text-xs md:text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {onNew && !newButtonHref && (
        <Button disabled={isCreating || disabled} size="sm" onClick={onNew}>
          <PlusIcon className="size-4" />
          {newButtonLabel}
        </Button>
      )}
      {!onNew && newButtonHref && (
        <Button size="sm" asChild>
          <Link prefetch href={newButtonHref}>
            <PlusIcon className="size-4" />
            {newButtonLabel}
          </Link>
        </Button>
      )}
    </div>
  );
};

type EntityContainerProps = {
  children: ReactNode;
  header: ReactNode;
  search: ReactNode;
  pagination: ReactNode;
};

export const EntityContainer = ({
  children,
  header,
  search,
  pagination,
}: EntityContainerProps) => {
  return (
    <div className="p-4 md:px-20 md:py-6 h-full">
      <div className="mx-auto max-w-screen w-full flex flex-col gap-y-8 h-full">
        {header}
        <div className="flex flex-col gap-y-4 h-full">
          {search}
          {children}
        </div>
        {pagination}
      </div>
    </div>
  );
};

type EntitySearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

export const EntitySearch = ({
  value,
  onChange,
  placeholder = "Search...",
}: EntitySearchProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <div className="flex w-full  items-center gap-x-2 justify-end">
      <InputGroup className="max-w-3/12">
        <InputGroupInput
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
        <InputGroupAddon align="inline-end">
          <TooltipWrapper content="Hold cmd+k or ctrl+k to focus">
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </TooltipWrapper>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
};

type EntityPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
};

export const EntityPagination = ({
  page,
  totalPages,
  onPageChange,
  disabled = false,
}: EntityPaginationProps) => {
  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex-1">
        <p className="text-muted-foreground text-sm">
          Page {page} of {totalPages}
        </p>
      </div>
      <ButtonGroup>
        <Button
          variant="outline"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={disabled || page === 1}
        >
          <ArrowLeftIcon />
          Previous
        </Button>
        <ButtonGroupSeparator />
        <Button
          variant="outline"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={disabled || page === totalPages}
        >
          Next
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>
    </div>
  );
};

type StateViewProps = {
  message: string;
};
export const LoadingStateView = ({ message }: StateViewProps) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <Spinner className="size-6" />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyContent>
        {Boolean(message) && <EmptyDescription>{message}</EmptyDescription>}
      </EmptyContent>
    </Empty>
  );
};

export const ErrorStateView = ({ message }: StateViewProps) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="text-red-500">
          <TriangleAlertIcon />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyContent>
        {Boolean(message) && (
          <EmptyDescription className="text-red-500">{message}</EmptyDescription>
        )}
      </EmptyContent>
    </Empty>
  );
};

type EmptyStateViewProps = StateViewProps & {
  onNew?: () => void;
  disabled?: boolean;
};

export const EmptyStateView = ({ onNew, message, disabled }: EmptyStateViewProps) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageOpenIcon />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyContent>
        {Boolean(message) && <EmptyDescription>{message}</EmptyDescription>}
        {Boolean(onNew) && (
          <Button onClick={onNew} disabled={disabled}>
            {disabled ? <Spinner /> : "Add workflow"}
          </Button>
        )}
      </EmptyContent>
    </Empty>
  );
};

type EntityListProps<T> = {
  items: T[];
  renderItem: (item: T, index?: number) => ReactNode;
  getKey: (item: T, index?: number) => string | number;
  emptyView?: ReactNode;
  className?: string;
};

export const EntityList = <T,>({
  items,
  getKey,
  renderItem,
  className,
  emptyView,
}: EntityListProps<T>) => {
  if (items.length === 0) {
    return emptyView ? (
      <div className="flex flex-1 justify-center items-center">{emptyView}</div>
    ) : null;
  }

  return (
    <div className={cn("flex flex-col gap-y-4 pt-10", className)}>
      {items.map((item, index) => (
        <div key={getKey(item, index)}>{renderItem(item, index)}</div>
      ))}
    </div>
  );
};

type EntityItemProps = {
  href: string;
  title: string;
  subtitle?: ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving: boolean;
  image?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

export const EntityItem = ({
  href,
  title,
  subtitle,
  onRemove,
  isRemoving,
  image,
  actions,
  className,
}: EntityItemProps) => {
  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isRemoving) {
      return;
    }

    if (onRemove) {
      await onRemove();
    }
  };

  return (
    <Link href={href} prefetch>
      <Card
        className={cn(
          "p-4 shadow-none hover:shadow cursor-pointer py-7",
          isRemoving && "opacity-50 cursor-not-allowed",
          className,
        )}
      >
        <CardContent className=" flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            {image}
            <div>
              <CardTitle className="text-base font-medium">{title}</CardTitle>
              {Boolean(subtitle) && (
                <CardDescription className="text-xs">{subtitle}</CardDescription>
              )}
            </div>
          </div>
          {(actions || onRemove) && (
            <div className="flex gap-x-4 items-center">
              {actions}
              {onRemove && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVerticalIcon className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenuItem onClick={handleRemove} disabled={isRemoving}>
                      <TrashIcon className="size-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};
