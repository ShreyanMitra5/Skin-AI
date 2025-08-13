'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getRecommendation } from '../lib/gemini';

export default function Camera() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [hasCamera, setHasCamera] = useState(false);
  const [snapshot, setSnapshot] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<string>('');
  const [loadingReco, setLoadingReco] = useState(false);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [stream]);

  const startCamera = useCallback(async () => {
    if (isStarting) return;
    setIsStarting(true);
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 720 },
          height: { ideal: 720 },
        },
        audio: false,
      });
      setStream(media);
      if (videoRef.current) {
        videoRef.current.srcObject = media;
        await videoRef.current.play();
      }
      setHasCamera(true);
    } catch (err) {
      console.error('Failed to access camera', err);
      setHasCamera(false);
    } finally {
      setIsStarting(false);
    }
  }, [isStarting]);

  const capture = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const size = Math.min(video.videoWidth || 720, video.videoHeight || 720) || 720;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame centered and cropped to a square
    const sx = (video.videoWidth - size) / 2;
    const sy = (video.videoHeight - size) / 2;
    try {
      ctx.drawImage(video, Math.max(0, sx), Math.max(0, sy), size, size, 0, 0, size, size);
    } catch (e) {
      // Fallback draw if metadata not ready
      ctx.drawImage(video, 0, 0, size, size);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setSnapshot(dataUrl);

    setLoadingReco(true);
    setRecommendation('');
    try {
      const reco = await getRecommendation(dataUrl);
      setRecommendation(reco);
    } finally {
      setLoadingReco(false);
    }
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col items-center">
          <div className="w-full max-w-xs">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-300 bg-black">
              <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button
              onClick={startCamera}
              disabled={isStarting || !!stream}
              className="rounded-md bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isStarting ? 'Starting…' : stream ? 'Camera Ready' : 'Start Camera'}
            </button>
            <button
              onClick={capture}
              disabled={!stream}
              className="rounded-md bg-emerald-600 px-4 py-2 text-white shadow hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Scan Skin
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full max-w-xs">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-gray-300 bg-gray-100">
              {snapshot ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={snapshot} alt="Snapshot" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">No snapshot</div>
              )}
            </div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <h2 className="mb-2 text-lg font-medium">AI Recommendation</h2>
        {loadingReco ? (
          <p className="text-gray-600">Analyzing your skin…</p>
        ) : recommendation ? (
          <p className="text-gray-800">{recommendation}</p>
        ) : (
          <p className="text-gray-500">Take a snapshot to see recommendations.</p>
        )}
      </div>
    </div>
  );
}
