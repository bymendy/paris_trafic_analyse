export default function Card({ title, children, noPad = false, style = {} }) {
  return (
    <div className="card" style={{ padding: noPad ? 0 : undefined, ...style }}>
      {title && (
        <div className="card-title" style={{ padding: noPad ? "14px 16px 0" : undefined }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
