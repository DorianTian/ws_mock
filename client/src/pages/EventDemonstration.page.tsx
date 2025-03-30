import React, { useEffect } from "react";

const EventDemonstration = () => {
  useEffect(() => {
    const handleCapture = (event: Event) => {
      console.log("Capture phase on", event.currentTarget);
      // if (event.currentTarget === event.target) {
      event.stopPropagation();
      // }
    };

    const handleBubble = (event: Event) => {
      console.log("Bubble phase on", event.currentTarget);
      event.stopPropagation();
    };

    const outerDiv = document.getElementById("outer");
    const middleDiv = document.getElementById("middle");
    const innerDiv = document.getElementById("inner");

    outerDiv?.addEventListener("click", handleCapture, true);
    middleDiv?.addEventListener("click", handleCapture, true);
    // innerDiv?.addEventListener("click", handleCapture, true);
    middleDiv?.addEventListener("click", handleBubble);
    innerDiv?.addEventListener("click", handleBubble);

    return () => {
      outerDiv?.removeEventListener("click", handleCapture, true);
      middleDiv?.removeEventListener("click", handleCapture, true);
      // innerDiv?.removeEventListener("click", handleCapture, true);
      middleDiv?.removeEventListener("click", handleBubble);
      innerDiv?.removeEventListener("click", handleBubble);
    };
  }, []);

  return (
    <div id="outer" style={{ padding: "50px", backgroundColor: "lightblue" }}>
      Outer Div (Capture Phase)
      <div
        id="middle"
        style={{ padding: "30px", backgroundColor: "lightgreen" }}
      >
        Middle Div (Bubble Phase)
        <div
          id="inner"
          style={{ padding: "10px", backgroundColor: "lightcoral" }}
          onClick={(e) => {
            console.log("Inner Div clicked");
          }}
        >
          Inner Div (Bubble Phase)
        </div>
      </div>
    </div>
  );
};

export default EventDemonstration;
