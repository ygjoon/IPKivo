import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "cn";
import { ArrowRight, Search } from "lucide-react";

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex w-full flex-col bg-popover text-popover-foreground",
        className,
      )}
      {...props}
    />
  );
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div className="flex items-center gap-2 border-b px-3">
      <Search
        className="size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "h-12 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[50dvh] overflow-x-hidden overflow-y-auto p-1",
        className,
      )}
      {...props}
    />
  );
}

function CommandEmpty(
  props: React.ComponentProps<typeof CommandPrimitive.Empty>,
) {
  return (
    <CommandPrimitive.Empty
      className="px-3 py-6 text-center text-sm text-muted-foreground"
      {...props}
    />
  );
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-2 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "flex cursor-pointer items-center gap-2 rounded-md px-2 py-2.5 text-sm outline-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

export function IpSearchCommand({
  ip,
  onIpChange,
  options,
  onSelect,
  enterIpLabel,
  enterValidIpLabel,
  suggestedLookupsLabel,
  searchIpLabel,
}: {
  ip: string;
  onIpChange: (value: string) => void;
  options: string[];
  onSelect: (value: string) => void;
  enterIpLabel: string;
  enterValidIpLabel: string;
  suggestedLookupsLabel: string;
  searchIpLabel: string;
}) {
  return (
    <Command shouldFilter={false} loop label={searchIpLabel}>
      <CommandInput
        autoFocus
        aria-label={enterIpLabel}
        placeholder={enterIpLabel}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        value={ip}
        onValueChange={onIpChange}
      />
      <CommandList>
        <CommandEmpty>{enterValidIpLabel}</CommandEmpty>
        <CommandGroup heading={!ip.trim() ? suggestedLookupsLabel : undefined}>
          {options.map((value) => (
            <CommandItem
              key={value}
              value={value}
              onSelect={() => onSelect(value)}
            >
              <Search aria-hidden="true" />
              <span className="min-w-0 flex-1 break-all">{value}</span>
              <ArrowRight aria-hidden="true" />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
};
