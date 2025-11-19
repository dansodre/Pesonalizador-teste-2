import React, { useEffect, useRef } from 'react';
import { Stage, Layer, Text, Image as KonvaImage, Transformer, Circle, Rect, Group } from 'react-konva';
import useImage from 'use-image';
import { CanvasItem, ProductTemplate } from '../types';
import Konva from 'konva';

// Sub-component to handle loading generic images
const URLImage = ({ item, onSelect, isSelected, draggable, onDragEnd, onTransformEnd }: any) => {
  // Enable CORS anonymous to allow exporting the canvas later
  const [image] = useImage(item.src || '', 'anonymous');
  const shapeRef = useRef<Konva.Image>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <KonvaImage
        image={image}
        ref={shapeRef}
        {...item}
        draggable={draggable}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onDragEnd({
            ...item,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          if(!node) return;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          
          onTransformEnd({
            ...item,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scaleX: scaleX,
            scaleY: scaleY,
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // Limit minimum size
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

// Sub-component for Text
const EditableText = ({ item, onSelect, isSelected, draggable, onDragEnd, onTransformEnd }: any) => {
  const shapeRef = useRef<Konva.Text>(null);
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    if (isSelected && trRef.current && shapeRef.current) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Text
        ref={shapeRef}
        {...item}
        draggable={draggable}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={(e) => {
          onDragEnd({
            ...item,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          if(!node) return;
          onTransformEnd({
            ...item,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            scaleX: node.scaleX(),
            scaleY: node.scaleY(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

interface CanvasStageProps {
  template: ProductTemplate;
  items: CanvasItem[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onChange: (id: string, newAttrs: Partial<CanvasItem>) => void;
  stageRef: React.RefObject<Konva.Stage>;
}

const CanvasStage: React.FC<CanvasStageProps> = ({
  template,
  items,
  selectedId,
  onSelect,
  onChange,
  stageRef
}) => {
  const { width, height, id: templateId } = template;
  const isRound = templateId.includes('round') || templateId.includes('redondo');

  const checkDeselect = (e: any) => {
    // deselect when clicked on empty area (Stage or the background shape)
    const clickedOnEmpty = e.target === e.target.getStage() || e.target.name() === 'background-shape';
    if (clickedOnEmpty) {
      onSelect(null);
    }
  };

  // Function to define the clipping area for the user content
  const clipFunc = (ctx: any) => {
    if (isRound) {
      ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2, false);
    } else {
      ctx.rect(0, 0, width, height);
    }
  };

  return (
    <div className="bg-slate-200 overflow-auto flex justify-center items-center p-8 h-full shadow-inner">
      {/* The container adapts to the content size */}
      <div 
        className="shadow-xl transition-all duration-300 ease-in-out" 
        style={{ 
            width, 
            height,
            // Remove background color from container so corners are transparent for round shapes
            background: 'transparent' 
        }}
      >
        <Stage
          width={width}
          height={height}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
          ref={stageRef}
        >
          <Layer>
            {/* 
                Background Shape: Represents the physical product (Paper/Sticker).
                This is rendered behind the content. 
            */}
            {isRound ? (
                <Circle 
                    x={width / 2} 
                    y={height / 2} 
                    radius={width / 2} 
                    fill="white" 
                    name="background-shape"
                    shadowColor="black"
                    shadowBlur={20}
                    shadowOpacity={0.1}
                />
            ) : (
                <Rect 
                    width={width} 
                    height={height} 
                    fill="white" 
                    name="background-shape"
                    shadowColor="black"
                    shadowBlur={20}
                    shadowOpacity={0.1}
                />
            )}

            {/* 
                User Content Group:
                We group all user items and apply a clip function so they don't 
                visually spill outside the product shape (e.g. corners of a circle).
            */}
            <Group clipFunc={clipFunc}>
                {items.map((item, i) => {
                if (item.type === 'image') {
                    return (
                    <URLImage
                        key={item.id}
                        item={item}
                        isSelected={item.id === selectedId}
                        onSelect={() => onSelect(item.id)}
                        draggable={true}
                        onDragEnd={(newAttrs: CanvasItem) => onChange(item.id, newAttrs)}
                        onTransformEnd={(newAttrs: CanvasItem) => onChange(item.id, newAttrs)}
                    />
                    );
                }
                return (
                    <EditableText
                    key={item.id}
                    item={item}
                    isSelected={item.id === selectedId}
                    onSelect={() => onSelect(item.id)}
                    draggable={true}
                    onDragEnd={(newAttrs: CanvasItem) => onChange(item.id, newAttrs)}
                    onTransformEnd={(newAttrs: CanvasItem) => onChange(item.id, newAttrs)}
                    />
                );
                })}
            </Group>
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default CanvasStage;