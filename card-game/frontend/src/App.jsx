import React, { useEffect, useState, useRef } from "react";
import { Stage, Layer, Image, Rect } from "react-konva";
import { io } from "socket.io-client";

const socket = io("http://localhost:3001");

const CARD_WIDTH = 100;
const CARD_HEIGHT = 150;
const slots = [
  { x: 150, y: 400 },
  { x: 300, y: 400 },
  { x: 450, y: 400 },
];

function App() {
  const [gameState, setGameState] = useState([]);
  const [cardPositions, setCardPositions] = useState([]);
  const [images, setImages] = useState({});
  const imageRefs = useRef([]);

  useEffect(() => {
    const loadImage = (name) => {
      return new Promise((resolve) => {
        const image = new window.Image();
        image.src = `${window.location.origin}/assets/${name}.png`;
        image.onload = () => resolve(image);
      });
    };

    // Load card images
    Promise.all([loadImage("knight"), loadImage("wizard")]).then((loadedImages) => {
      setImages({
        knight: loadedImages[0],
        wizard: loadedImages[1],
      });
    });
  }, []);

  const playCard = (cardName) => {
    const newGameState = [...gameState, { name: cardName, x: 100, y: 200 }];
    setGameState(newGameState);
    setCardPositions(newGameState);
    socket.emit("playCard", newGameState);
  };

  const handleDragEnd = (e, index) => {
    const newX = e.target.x();
    const newY = e.target.y();

    // Find closest slot
    let closestSlot = slots.reduce((closest, slot) => {
      const distance = Math.hypot(slot.x - newX, slot.y - newY);
      return distance < closest.distance ? { ...slot, distance } : closest;
    }, { distance: Infinity });

    const newPositions = [...cardPositions];
    newPositions[index] = { ...newPositions[index], x: closestSlot.x, y: closestSlot.y };
    setCardPositions(newPositions);
  };

  return (
    <div>
      <h1>Card Game</h1>
      <button onClick={() => playCard("knight")}>Play Knight</button>
      <button onClick={() => playCard("wizard")}>Play Wizard</button>

      <h2>Game State:</h2>
      <ul>
        {gameState.map((card, index) => (
          <li key={index}>{card.name}</li>
        ))}
      </ul>

      <Stage width={800} height={600} style={{ background: "#1099bb" }}>
        <Layer>
          {/* Render Slots */}
          {slots.map((slot, i) => (
            <Rect key={i} x={slot.x} y={slot.y} width={CARD_WIDTH} height={CARD_HEIGHT} fill="white" opacity={0.3} />
          ))}

          {/* Render Cards */}
          {cardPositions.map((card, i) => (
            <Image
              key={i}
              x={card.x}
              y={card.y}
              width={CARD_WIDTH}
              height={CARD_HEIGHT}
              image={images[card.name]}
              draggable
              onDragEnd={(e) => handleDragEnd(e, i)}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
