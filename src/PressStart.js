import React, { useEffect, useRef, useState } from "react";

export default function PressStart({ phase }) {
  const [styles, setStyles] = useState();
  const ref = useRef();
  useEffect(() => {
    const rect = ref.current.getBoundingClientRect();
    setStyles({
      marginLeft: -rect.width / 2 + "px",
      marginTop: -rect.height / 2 + "px",
    });
  }, []);

  useEffect(() => {
    if (phase === 1) {
      setStyles({
        ...styles,
        opacity: 0,
      });
    }
  }, [phase]);
  return (
    <div ref={ref} style={styles} id="press-start">
      Press
    </div>
  );
}
