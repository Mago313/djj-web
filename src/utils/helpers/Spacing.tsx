export const Spacing = ({ children }: { children: React.ReactChild }) => {
  return (
    <div
      style={{
        paddingTop: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textDecoration: 'none',
      }}
    >
      {children}
    </div>
  );
};
