import React, { useMemo, useRef, useState } from "react";
import { useToast } from "../components/Toast";

const CleaningPage: React.FC = () => {
  const [original, setOriginal] = useState<string | null>(null);
  const [processed, setProcessed] = useState<string | null>(null);
  const [threshold, setThreshold] = useState(160);
  const [slider, setSlider] = useState(50);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { notify } = useToast();

  const handleFile = async (file: File | null) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setOriginal(url);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const avg =
          (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
        const normalized = Math.min(255, Math.max(0, (avg / 255) * 255));
        const truncated = normalized > threshold ? threshold : normalized;
        imageData.data[i] = truncated;
        imageData.data[i + 1] = truncated;
        imageData.data[i + 2] = truncated;
      }
      ctx.putImageData(imageData, 0, 0);
      setProcessed(canvas.toDataURL("image/png"));
      notify("已完成模拟清洗", "success");
    };
    img.src = url;
  };

  const processedStyle = useMemo(
    () => ({
      width: `${slider}%`
    }),
    [slider]
  );

  return (
    <div className="space-y-6">
      <div className="rounded bg-white p-4 shadow">
        <h2 className="text-lg font-semibold">影像数据清洗</h2>
        <p className="text-sm text-slate-500">归一化 + 阈值截断模拟处理。</p>
        <div className="mt-4 flex items-center gap-4">
          <input
            type="file"
            accept="image/*"
            onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
          />
          <label className="text-sm">
            阈值截断
            <input
              type="range"
              min={80}
              max={240}
              value={threshold}
              onChange={(event) => setThreshold(Number(event.target.value))}
              className="ml-2 align-middle"
            />
          </label>
        </div>
      </div>
      <div className="rounded bg-white p-4 shadow">
        <h3 className="text-md font-semibold">清洗前后对比</h3>
        {original && processed ? (
          <div className="mt-4">
            <div className="relative overflow-hidden rounded border">
              <img src={original} alt="original" className="block w-full" />
              <img
                src={processed}
                alt="processed"
                className="absolute left-0 top-0 h-full object-cover"
                style={processedStyle}
              />
            </div>
            <input
              type="range"
              className="mt-4 w-full"
              min={0}
              max={100}
              value={slider}
              onChange={(event) => setSlider(Number(event.target.value))}
            />
          </div>
        ) : (
          <div className="mt-4 text-sm text-slate-500">请上传影像文件</div>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CleaningPage;
