import React from 'react';
import { LiquidFilters } from './LiquidFilters';
import { LiquidCursor } from './LiquidCursor';
import { LiquidBackground } from './LiquidBackground';
import { LiquidTransition } from './LiquidTransition';
import { LiquidPageWrapper } from './LiquidPageWrapper';
import { LiquidBlob } from './LiquidBlob';
import { LiquidWaves } from './LiquidWaves';
import { LiquidRipple } from './LiquidRipple';

interface LiquidMotionSystemProps {
  children: React.ReactNode;
  enableBackground?: boolean;
  enableInteractions?: boolean;
  enableTransitions?: boolean;
  theme?: 'dark' | 'light';
}

export const LiquidMotionSystem: React.FC<LiquidMotionSystemProps> = ({
  children,
  enableBackground = true,
  enableInteractions = true,
  enableTransitions = true,
  theme = 'dark',
}) => {
  return (
    <div className={`liquid-motion-system theme-${theme}`}>
      <LiquidFilters />

      {enableBackground && (
        <>
          <LiquidBackground intensity={0.3} speed={0.5} />
          <LiquidBlob size={300} color="var(--accent-purple)" speed={0.8} className="liquid-blob-1" />
          <LiquidBlob size={400} color="var(--accent-teal)" speed={1.2} className="liquid-blob-2" />
          <LiquidWaves count={4} className="liquid-waves-bg" />
        </>
      )}

      {enableTransitions ? (
        <LiquidPageWrapper>
          <LiquidTransition>
            {enableInteractions ? (
              <LiquidCursor intensity={0.3}>
                <LiquidRipple color="var(--accent-purple)">
                  {children}
                </LiquidRipple>
              </LiquidCursor>
            ) : (
              children
            )}
          </LiquidTransition>
        </LiquidPageWrapper>
      ) : (
        enableInteractions ? (
          <LiquidCursor intensity={0.3}>
            <LiquidRipple color="var(--accent-purple)">
              {children}
            </LiquidRipple>
          </LiquidCursor>
        ) : (
          children
        )
      )}
    </div>
  );
};
