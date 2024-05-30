import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';

import Icon from '../Icon';
import Tooltip from '../Tooltip';
import InputRange from '../InputRange';

import './CinePlayer.css';

export type CinePlayerProps = {
  className: string;
  isPlaying: boolean;
  minFrameRate?: number;
  maxFrameRate?: number;
  stepFrameRate?: number;
  frameRate?: number;
  onFrameRateChange: (value: number) => void;
  onPlayPauseChange: (value: boolean) => void;
  onClose: () => void;
  updateDynamicInfo?: () => void;
  dynamicInfo?: {
    timePointIndex: number;
    numTimePoints: number;
    label?: string;
  };
};

const fpsButtonClassNames =
  'cursor-pointer text-primary-active active:text-primary-light hover-bg-customblue-300 w-3 flex items-center justify-center';

const CinePlayer: React.FC<CinePlayerProps> = ({
  className,
  isPlaying,
  minFrameRate,
  maxFrameRate,
  stepFrameRate,
  frameRate: defaultFrameRate,
  dynamicInfo = {},
  onFrameRateChange,
  onPlayPauseChange,
  onClose,
  updateDynamicInfo,
}) => {
  const isDynamic = !!dynamicInfo?.numTimePoints;
  const [frameRate, setFrameRate] = useState(defaultFrameRate);
  const debouncedSetFrameRate = useCallback(debounce(onFrameRateChange, 100), [onFrameRateChange]);

  const getPlayPauseIconName = () => (isPlaying ? 'icon-pause' : 'icon-play');

  const handleSetFrameRate = (frameRate: number) => {
    if (frameRate < minFrameRate || frameRate > maxFrameRate) {
      return;
    }
    setFrameRate(frameRate);
    debouncedSetFrameRate(frameRate);
  };

  useEffect(() => {
    setFrameRate(defaultFrameRate);
  }, [defaultFrameRate]);

  const handleTimePointChange = useCallback(
    (newIndex: number) => {
      if (isDynamic && dynamicInfo) {
        updateDynamicInfo({
          ...dynamicInfo,
          timePointIndex: newIndex,
        });
      }
    },
    [isDynamic, dynamicInfo]
  );

  return (
    <div
      className={className}
      style={{ opacity: '0.85' }}
    >
      {isDynamic && dynamicInfo && (
        <InputRange
          value={dynamicInfo.timePointIndex}
          onChange={handleTimePointChange}
          minValue={0}
          maxValue={dynamicInfo.numTimePoints - 1}
          step={1}
          containerClassName="mb-2 w-full"
          labelClassName="text-xs text-white"
          leftColor="#3a3f99"
          rightColor="#3a3f99"
          trackHeight="3px"
          thumbColor="#348cfd"
          thumbColorOuter="#000000"
          showLabel={false}
        />
      )}
      <div className=" bg-secondary-dark inline-flex select-none items-center gap-6 rounded px-1 py-1">
        <Icon
          name={getPlayPauseIconName()}
          className="active:text-primary-light hover-bg-customblue-300 h-5 w-5 cursor-pointer text-white hover:rounded"
          onClick={() => onPlayPauseChange(!isPlaying)}
        />
        {isDynamic && dynamicInfo && (
          <div className="min-w-12 max-w-20 flex flex-col text-white">
            <div className="text-10px">
              <span className="w-2 text-white">{dynamicInfo.timePointIndex}</span>{' '}
              <span className="text-aqua-pale">{`/${dynamicInfo.numTimePoints}`}</span>
            </div>
            <div className="text-aqua-pale text-xs">{dynamicInfo.label}</div>
          </div>
        )}
        <div className="bg-primary-dark flex h-5 items-stretch gap-2 rounded px-2 ">
          <div
            className={`${fpsButtonClassNames} rounded-l`}
            onClick={() => handleSetFrameRate(frameRate - 1)}
          >
            <Icon name="arrow-left-small" />
          </div>
          <Tooltip
            position="top"
            className="group/fps cine-fps-range-tooltip"
            tight={true}
            content={
              <InputRange
                containerClassName="h-8 px-2"
                inputClassName="w-36"
                value={frameRate}
                minValue={minFrameRate}
                maxValue={maxFrameRate}
                step={stepFrameRate}
                onChange={handleSetFrameRate}
                showLabel={false}
              />
            }
          >
            <div className="flex items-center justify-center gap-1">
              <div className="flex-shrink-0 text-center text-xs leading-[20px] text-white">
                <span className="inline-block text-right">{`${frameRate} `}</span>
                <span className="text-aqua-pale text-10px whitespace-nowrap">{' FPS'}</span>
              </div>
            </div>
          </Tooltip>
          <div
            className={`${fpsButtonClassNames} rounded-r`}
            onClick={() => handleSetFrameRate(frameRate + 1)}
          >
            <Icon name="arrow-right-small" />
          </div>
        </div>
        <Icon
          name="icon-close"
          className="text-primary-active active:text-primary-light hover-bg-customblue-300 h-5 w-5 cursor-pointer hover:rounded"
          onClick={onClose}
        />
      </div>
    </div>
  );
};

const noop = () => {};

CinePlayer.defaultProps = {
  isPlaying: false,
  minFrameRate: 1,
  maxFrameRate: 90,
  stepFrameRate: 1,
  frameRate: 24,
  onPlayPauseChange: noop,
  onFrameRateChange: noop,
  onClose: noop,
  isDynamic: false,
  dynamicInfo: {},
};

CinePlayer.propTypes = {
  minFrameRate: PropTypes.number,
  maxFrameRate: PropTypes.number,
  stepFrameRate: PropTypes.number,
  frameRate: PropTypes.number,
  isPlaying: PropTypes.bool.isRequired,
  onPlayPauseChange: PropTypes.func,
  onFrameRateChange: PropTypes.func,
  onClose: PropTypes.func,
  isDynamic: PropTypes.bool,
  dynamicInfo: PropTypes.shape({
    timePointIndex: PropTypes.number,
    numTimePoints: PropTypes.number,
    label: PropTypes.string,
  }),
};

export default CinePlayer;
