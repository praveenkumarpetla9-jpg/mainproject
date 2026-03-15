// ══════════════════════════════════════════
// components/Toast.js
// Floating notification that auto-dismisses
// after 4 seconds. Triggered via showToast()
// callback passed down from App.
// ══════════════════════════════════════════

function Toast({ msg, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="toast">
      🔔 {msg}
    </div>
  );
}
