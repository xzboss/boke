import Icon from "@/components/Icon";

export const Empty = ({
  children = null,
  ...rest
}: {
  children?: React.ReactNode;
  [key: string]: unknown;
}) => {
  return (
    <>
      <Icon type="icon-empty" {...rest} />
      {children}
    </>
  );
};

export default Empty;
