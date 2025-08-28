
import React from 'react';

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:ring-offset-gray-950 dark:placeholder:text-gray-400 dark:focus:ring-gray-800 appearance-none bg-chevron-down bg-no-repeat bg-right pr-8 ${className}`}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';

const SelectItem: React.FC<React.OptionHTMLAttributes<HTMLOptionElement>> = (props) => {
  return <option {...props} />;
};
SelectItem.displayName = 'SelectItem';

export { Select, SelectItem };
