// ══════════════════════════════════════════
// components/Spark.js
// Tiny inline sparkline chart used on the
// Prices page inside each crop price card.
// Renders a borderless Chart.js line chart
// at a fixed 30px height.
//
// Props:
//   data  — number[]  price values to plot
//   color — string    CSS color for the line
// ══════════════════════════════════════════

function Spark({ data, color }) {
  const ref  = useRef();
  const inst = useRef();

  useEffect(() => {
    // Destroy previous instance before re-drawing
    if (inst.current) { inst.current.destroy(); inst.current = null; }
    if (!ref.current) return;

    inst.current = new Chart(ref.current, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data,
          borderColor: color,
          borderWidth: 1.5,
          pointRadius: 0,
          tension: 0.4,
          fill: false,
        }]
      },
      options: {
        responsive: false,
        plugins: {
          legend:  { display: false },
          tooltip: { enabled: false },
        },
        scales: {
          x: { display: false },
          y: { display: false },
        },
        animation: { duration: 0 },
      }
    });
  }, [data, color]);

  return <canvas ref={ref} className="spark" height={30}/>;
}
