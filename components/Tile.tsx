import React, { useState } from 'react';
import { GRID_SIZE } from '../utils/gameLogic';

interface TileProps {
  id: number;
  currentPos: number;
  correctPos: number;
  imageSrc: string;
  onClick: () => void;
  sizePercentage: number; // e.g. 33.333%
}

export const TileComponent: React.FC<TileProps> = ({
  currentPos,
  correctPos,
  imageSrc,
  onClick,
  sizePercentage
}) => {
  // Calculate position in percentage for absolute positioning
  const row = Math.floor(currentPos / GRID_SIZE);
  const col = currentPos % GRID_SIZE;
  
  const top = row * sizePercentage;
  const left = col * sizePercentage;

  // Calculate background position
  const correctRow = Math.floor(correctPos / GRID_SIZE);
  const correctCol = correctPos % GRID_SIZE;
  
  return (
    <div
      onClick={onClick}
      className="absolute cursor-pointer border border-white box-border transition-all duration-200 ease-in-out hover:scale-[0.98] shadow-sm rounded-sm overflow-hidden hover:z-10 hover:shadow-lg hover:border-softplan-blue/30"
      style={{
        width: `${sizePercentage}%`,
        height: `${sizePercentage}%`,
        top: `${top}%`,
        left: `${left}%`,
      }}
    >
        <div 
            className="w-full h-full"
            style={{
                backgroundImage: `url(${imageSrc})`,
                backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
                backgroundPosition: `${-correctCol * 100}% ${-correctRow * 100}%`
            }}
        >
        </div>
    </div>
  );
};