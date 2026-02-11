import type Konva from "konva";

const W = 1920;
const H = 1080;

export function captureStageAsDataUrl(stage: Konva.Stage | null): string | undefined {
  if (!stage) return undefined;

  const prevScaleX = stage.scaleX();
  const prevScaleY = stage.scaleY();
  const prevWidth = stage.width();
  const prevHeight = stage.height();

  stage.scaleX(1);
  stage.scaleY(1);
  stage.width(W);
  stage.height(H);

  const transformer = stage.findOne("Transformer");
  const trWasVisible = transformer?.visible() ?? false;
  transformer?.visible(false);

  stage.batchDraw();

  const dataUrl = stage.toDataURL({ pixelRatio: 1 });

  transformer?.visible(trWasVisible);
  stage.scaleX(prevScaleX);
  stage.scaleY(prevScaleY);
  stage.width(prevWidth);
  stage.height(prevHeight);
  stage.batchDraw();

  return dataUrl;
}
