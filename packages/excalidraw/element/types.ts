import { Point } from "../types";
import {
  FONT_FAMILY,
  FONT_STYLE,
  FONT_WEIGHT,
  ROUNDNESS,
  TEXT_ALIGN,
  TEXT_DECORATION,
  THEME,
  VERTICAL_ALIGN,
} from "../constants";
import { MakeBrand, MarkNonNullable, ValueOf } from "../utility-types";
import { MagicCacheData } from "../data/magic";

export type ChartType = "bar" | "line";
export type FillStyle = "hachure" | "cross-hatch" | "solid" | "zigzag";
export type FontFamilyKeys = keyof typeof FONT_FAMILY;
export type FontFamilyValues = typeof FONT_FAMILY[FontFamilyKeys];
export type Theme = typeof THEME[keyof typeof THEME];
export type FontString = string & { _brand: "fontString" };
export type GroupId = string;
export type PointerType = "mouse" | "pen" | "touch";
export type StrokeRoundness = "round" | "sharp";
export type RoundnessType = ValueOf<typeof ROUNDNESS>;
export type StrokeStyle = "solid" | "dashed" | "dotted";
export type FontStyleKeys = keyof typeof FONT_STYLE;
export type FontStyleValues = typeof FONT_STYLE[FontStyleKeys];
export type FontWeightKeys = keyof typeof FONT_WEIGHT;
export type FontWeightValues = typeof FONT_WEIGHT[FontWeightKeys];
export type TextDecorationKeys = keyof typeof TEXT_DECORATION;
export type TextDecorationValues = typeof TEXT_DECORATION[TextDecorationKeys];
export type TextAlign = typeof TEXT_ALIGN[keyof typeof TEXT_ALIGN];

type VerticalAlignKeys = keyof typeof VERTICAL_ALIGN;
export type VerticalAlign = typeof VERTICAL_ALIGN[VerticalAlignKeys];

type _ExcalidrawElementBase = Readonly<{
  id: string;
  x: number;
  y: number;
  strokeColor: string;
  backgroundColor: string;
  fillStyle: FillStyle;
  strokeWidth: number;
  strokeStyle: StrokeStyle;
  roundness: null | { type: RoundnessType; value?: number };
  roughness: number;
  opacity: number;
  width: number;
  height: number;
  angle: number;
  /** Random integer used to seed shape generation so that the roughjs shape
      doesn't differ across renders. */
  seed: number;
  /** Integer that is sequentially incremented on each change. Used to reconcile
      elements during collaboration or when saving to server. */
  version: number;
  /** Random integer that is regenerated on each change.
      Used for deterministic reconciliation of updates during collaboration,
      in case the versions (see above) are identical. */
  versionNonce: number;
  isDeleted: boolean;
  /** List of groups the element belongs to.
      Ordered from deepest to shallowest. */
  groupIds: readonly GroupId[];
  frameId: string | null;
  /** other elements that are bound to this element */
  boundElements:
    | readonly Readonly<{
        id: ExcalidrawLinearElement["id"];
        type: "arrow" | "text";
      }>[]
    | null;
  /** epoch (ms) timestamp of last element update */
  updated: number;
  link: string | null;
  locked: boolean;
  customData?: Record<string, any>;
}>;

export type ExcalidrawSelectionElement = _ExcalidrawElementBase & {
  type: "selection";
};

export type ExcalidrawRectangleElement = _ExcalidrawElementBase & {
  type: "rectangle";
};

export type ExcalidrawDiamondElement = _ExcalidrawElementBase & {
  type: "diamond";
};

export type ExcalidrawEllipseElement = _ExcalidrawElementBase & {
  type: "ellipse";
};

export type ExcalidrawEmbeddableElement = _ExcalidrawElementBase &
  Readonly<{
    type: "embeddable";
  }>;

export type ExcalidrawIframeElement = _ExcalidrawElementBase &
  Readonly<{
    type: "iframe";
    // TODO move later to AI-specific frame
    customData?: { generationData?: MagicCacheData };
  }>;

export type ExcalidrawIframeLikeElement =
  | ExcalidrawIframeElement
  | ExcalidrawEmbeddableElement;

export type IframeData =
  | {
      intrinsicSize: { w: number; h: number };
      error?: Error;
    } & (
      | { type: "video" | "generic"; link: string }
      | { type: "document"; srcdoc: (theme: Theme) => string }
    );

export type ExcalidrawImageElement = _ExcalidrawElementBase &
  Readonly<{
    type: "image";
    fileId: FileId | null;
    /** whether respective file is persisted */
    status: "pending" | "saved" | "error";
    /** X and Y scale factors <-1, 1>, used for image axis flipping */
    scale: [number, number];
  }>;

export type InitializedExcalidrawImageElement = MarkNonNullable<
  ExcalidrawImageElement,
  "fileId"
>;

export type ExcalidrawFrameElement = _ExcalidrawElementBase & {
  type: "frame";
  name: string | null;
};

export type ExcalidrawMagicFrameElement = _ExcalidrawElementBase & {
  type: "magicframe";
  name: string | null;
};

export type ExcalidrawFrameLikeElement =
  | ExcalidrawFrameElement
  | ExcalidrawMagicFrameElement;

/**
 * These are elements that don't have any additional properties.
 */
export type ExcalidrawGenericElement =
  | ExcalidrawSelectionElement
  | ExcalidrawRectangleElement
  | ExcalidrawDiamondElement
  | ExcalidrawEllipseElement;

/**
 * ExcalidrawElement should be JSON serializable and (eventually) contain
 * no computed data. The list of all ExcalidrawElements should be shareable
 * between peers and contain no state local to the peer.
 */
export type ExcalidrawElement =
  | ExcalidrawGenericElement
  | ExcalidrawTextElement
  | ExcalidrawLinearElement
  | ExcalidrawFreeDrawElement
  | ExcalidrawImageElement
  | ExcalidrawFrameElement
  | ExcalidrawMagicFrameElement
  | ExcalidrawIframeElement
  | ExcalidrawEmbeddableElement;

export type NonDeleted<TElement extends ExcalidrawElement> = TElement & {
  isDeleted: boolean;
};

export type NonDeletedExcalidrawElement = NonDeleted<ExcalidrawElement>;

export type ExcalidrawTextElement = _ExcalidrawElementBase &
  Readonly<{
    type: "text";
    fontSize: number;
    fontFamily: FontFamilyValues;
    fontStyle: FontStyleValues;
    fontWeight: FontWeightValues;
    textDecoration: TextDecorationValues;
    text: string;
    baseline: number;
    textAlign: TextAlign;
    verticalAlign: VerticalAlign;
    containerId: ExcalidrawGenericElement["id"] | null;
    originalText: string;
    /**
     * Unitless line height (aligned to W3C). To get line height in px, multiply
     *  with font size (using `getLineHeightInPx` helper).
     */
    lineHeight: number & { _brand: "unitlessLineHeight" };
  }>;

export type ExcalidrawBindableElement =
  | ExcalidrawRectangleElement
  | ExcalidrawDiamondElement
  | ExcalidrawEllipseElement
  | ExcalidrawTextElement
  | ExcalidrawImageElement
  | ExcalidrawIframeElement
  | ExcalidrawEmbeddableElement
  | ExcalidrawFrameElement
  | ExcalidrawMagicFrameElement;

export type ExcalidrawTextContainer =
  | ExcalidrawRectangleElement
  | ExcalidrawDiamondElement
  | ExcalidrawEllipseElement
  | ExcalidrawArrowElement;

export type ExcalidrawTextElementWithContainer = {
  containerId: ExcalidrawTextContainer["id"];
} & ExcalidrawTextElement;

export type PointBinding = {
  elementId: ExcalidrawBindableElement["id"];
  focus: number;
  gap: number;
};

export type Arrowhead =
  | "arrow"
  | "bar"
  | "dot" // legacy. Do not use for new elements.
  | "circle"
  | "circle_outline"
  | "triangle"
  | "triangle_outline"
  | "diamond"
  | "diamond_outline";

export type ExcalidrawLinearElement = _ExcalidrawElementBase &
  Readonly<{
    type: "line" | "arrow";
    points: readonly Point[];
    lastCommittedPoint: Point | null;
    startBinding: PointBinding | null;
    endBinding: PointBinding | null;
    startArrowhead: Arrowhead | null;
    endArrowhead: Arrowhead | null;
  }>;

export type ExcalidrawArrowElement = ExcalidrawLinearElement &
  Readonly<{
    type: "arrow";
  }>;

export type ExcalidrawFreeDrawElement = _ExcalidrawElementBase &
  Readonly<{
    type: "freedraw";
    points: readonly Point[];
    pressures: readonly number[];
    simulatePressure: boolean;
    lastCommittedPoint: Point | null;
  }>;

export type FileId = string & { _brand: "FileId" };

export type ExcalidrawElementType = ExcalidrawElement["type"];

/**
 * Map of excalidraw elements.
 * Unspecified whether deleted or non-deleted.
 * Can be a subset of Scene elements.
 */
export type ElementsMap = Map<ExcalidrawElement["id"], ExcalidrawElement>;

/**
 * Map of non-deleted elements.
 * Can be a subset of Scene elements.
 */
export type NonDeletedElementsMap = Map<
  ExcalidrawElement["id"],
  NonDeletedExcalidrawElement
> &
  MakeBrand<"NonDeletedElementsMap">;

/**
 * Map of all excalidraw Scene elements, including deleted.
 * Not a subset. Use this type when you need access to current Scene elements.
 */
export type SceneElementsMap = Map<ExcalidrawElement["id"], ExcalidrawElement> &
  MakeBrand<"SceneElementsMap">;

/**
 * Map of all non-deleted Scene elements.
 * Not a subset. Use this type when you need access to current Scene elements.
 */
export type NonDeletedSceneElementsMap = Map<
  ExcalidrawElement["id"],
  NonDeletedExcalidrawElement
> &
  MakeBrand<"NonDeletedSceneElementsMap">;

export type ElementsMapOrArray =
  | readonly ExcalidrawElement[]
  | Readonly<ElementsMap>;
