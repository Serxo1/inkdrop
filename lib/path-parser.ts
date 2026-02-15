// SVG path `d` attribute parser and manipulator

export interface Point {
  x: number;
  y: number;
}

export type PathCommandType =
  | "M" | "m"
  | "L" | "l"
  | "H" | "h"
  | "V" | "v"
  | "C" | "c"
  | "S" | "s"
  | "Q" | "q"
  | "T" | "t"
  | "A" | "a"
  | "Z" | "z";

export interface PathCommand {
  type: PathCommandType;
  point?: Point;       // endpoint (M, L, C, Q, S, T, A, H, V)
  cp1?: Point;         // first control point (C, S)
  cp2?: Point;         // second control point (C)
  cp?: Point;          // single control point (Q)
  params?: number[];   // arc params: rx, ry, rotation, largeArc, sweep
}

export interface AnchorPoint {
  commandIndex: number;
  position: Point;
  handleIn?: Point;   // incoming bezier handle (absolute)
  handleOut?: Point;  // outgoing bezier handle (absolute)
}

// ---------- Tokenizer ----------

const NUMBER_RE = /[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/g;

function tokenizeNumbers(s: string): number[] {
  const matches = s.match(NUMBER_RE);
  return matches ? matches.map(Number) : [];
}

const COMMAND_RE = /([MmLlHhVvCcSsQqTtAaZz])((?:[^MmLlHhVvCcSsQqTtAaZz])*)/g;

// ---------- Parser ----------

export function parsePath(d: string): PathCommand[] {
  const commands: PathCommand[] = [];
  let match: RegExpExecArray | null;

  COMMAND_RE.lastIndex = 0;
  while ((match = COMMAND_RE.exec(d)) !== null) {
    const type = match[1] as PathCommandType;
    const nums = tokenizeNumbers(match[2]);

    if (type === "Z" || type === "z") {
      commands.push({ type });
      continue;
    }

    const paramsPerCommand = PARAMS_COUNT[type.toUpperCase() as Uppercase<PathCommandType>];
    if (paramsPerCommand === 0) continue;

    if (nums.length === 0) {
      commands.push({ type });
      continue;
    }

    // Handle implicit repeated commands
    for (let i = 0; i < nums.length; i += paramsPerCommand) {
      const slice = nums.slice(i, i + paramsPerCommand);
      if (slice.length < paramsPerCommand) break;

      // For implicit repeats after M, use L/l
      const cmdType: PathCommandType =
        i > 0 && (type === "M" || type === "m")
          ? type === "M" ? "L" : "l"
          : type;

      commands.push(buildCommand(cmdType, slice));
    }
  }

  return commands;
}

const PARAMS_COUNT: Record<string, number> = {
  M: 2, L: 2, H: 1, V: 1,
  C: 6, S: 4, Q: 4, T: 2,
  A: 7, Z: 0,
};

function buildCommand(type: PathCommandType, nums: number[]): PathCommand {
  switch (type.toUpperCase()) {
    case "M":
    case "L":
    case "T":
      return { type, point: { x: nums[0], y: nums[1] } };
    case "H":
      return { type, point: { x: nums[0], y: 0 } };
    case "V":
      return { type, point: { x: 0, y: nums[0] } };  // V stores Y value
    case "C":
      return {
        type,
        cp1: { x: nums[0], y: nums[1] },
        cp2: { x: nums[2], y: nums[3] },
        point: { x: nums[4], y: nums[5] },
      };
    case "S":
      return {
        type,
        cp1: { x: nums[0], y: nums[1] },
        point: { x: nums[2], y: nums[3] },
      };
    case "Q":
      return {
        type,
        cp: { x: nums[0], y: nums[1] },
        point: { x: nums[2], y: nums[3] },
      };
    case "A":
      return {
        type,
        params: [nums[0], nums[1], nums[2], nums[3], nums[4]],
        point: { x: nums[5], y: nums[6] },
      };
    case "Z":
      return { type };
    default:
      return { type };
  }
}

// ---------- Convert to absolute ----------

export function toAbsoluteCommands(commands: PathCommand[]): PathCommand[] {
  const result: PathCommand[] = [];
  let cx = 0, cy = 0; // current point
  let sx = 0, sy = 0; // subpath start

  for (const cmd of commands) {
    const isRel = cmd.type === cmd.type.toLowerCase() && cmd.type !== "Z" && cmd.type !== "z";
    const upper = cmd.type.toUpperCase() as PathCommandType;

    switch (upper) {
      case "M": {
        const px = (isRel ? cx : 0) + (cmd.point?.x ?? 0);
        const py = (isRel ? cy : 0) + (cmd.point?.y ?? 0);
        result.push({ type: "M", point: { x: px, y: py } });
        cx = px; cy = py;
        sx = cx; sy = cy;
        break;
      }
      case "L":
      case "T": {
        const px = (isRel ? cx : 0) + (cmd.point?.x ?? 0);
        const py = (isRel ? cy : 0) + (cmd.point?.y ?? 0);
        result.push({ type: upper, point: { x: px, y: py } });
        cx = px; cy = py;
        break;
      }
      case "H": {
        const px = (isRel ? cx : 0) + (cmd.point?.x ?? 0);
        result.push({ type: "H", point: { x: px, y: 0 } });
        cx = px;
        break;
      }
      case "V": {
        const py = (isRel ? cy : 0) + (cmd.point?.y ?? 0);
        result.push({ type: "V", point: { x: 0, y: py } });
        cy = py;
        break;
      }
      case "C": {
        const ox = isRel ? cx : 0;
        const oy = isRel ? cy : 0;
        const abs: PathCommand = {
          type: "C",
          cp1: { x: ox + (cmd.cp1?.x ?? 0), y: oy + (cmd.cp1?.y ?? 0) },
          cp2: { x: ox + (cmd.cp2?.x ?? 0), y: oy + (cmd.cp2?.y ?? 0) },
          point: { x: ox + (cmd.point?.x ?? 0), y: oy + (cmd.point?.y ?? 0) },
        };
        result.push(abs);
        cx = abs.point!.x; cy = abs.point!.y;
        break;
      }
      case "S": {
        const ox = isRel ? cx : 0;
        const oy = isRel ? cy : 0;
        const abs: PathCommand = {
          type: "S",
          cp1: { x: ox + (cmd.cp1?.x ?? 0), y: oy + (cmd.cp1?.y ?? 0) },
          point: { x: ox + (cmd.point?.x ?? 0), y: oy + (cmd.point?.y ?? 0) },
        };
        result.push(abs);
        cx = abs.point!.x; cy = abs.point!.y;
        break;
      }
      case "Q": {
        const ox = isRel ? cx : 0;
        const oy = isRel ? cy : 0;
        const abs: PathCommand = {
          type: "Q",
          cp: { x: ox + (cmd.cp?.x ?? 0), y: oy + (cmd.cp?.y ?? 0) },
          point: { x: ox + (cmd.point?.x ?? 0), y: oy + (cmd.point?.y ?? 0) },
        };
        result.push(abs);
        cx = abs.point!.x; cy = abs.point!.y;
        break;
      }
      case "A": {
        const ox = isRel ? cx : 0;
        const oy = isRel ? cy : 0;
        const abs: PathCommand = {
          type: "A",
          params: cmd.params ? [...cmd.params] : [0, 0, 0, 0, 0],
          point: { x: ox + (cmd.point?.x ?? 0), y: oy + (cmd.point?.y ?? 0) },
        };
        result.push(abs);
        cx = abs.point!.x; cy = abs.point!.y;
        break;
      }
      case "Z": {
        result.push({ type: "Z" });
        cx = sx; cy = sy;
        break;
      }
    }
  }

  return result;
}

// ---------- Serialize ----------

export function serializePath(commands: PathCommand[]): string {
  return commands.map((cmd) => {
    switch (cmd.type.toUpperCase()) {
      case "M":
      case "L":
      case "T":
        return `${cmd.type}${fmt(cmd.point!.x)} ${fmt(cmd.point!.y)}`;
      case "H":
        return `${cmd.type}${fmt(cmd.point!.x)}`;
      case "V":
        return `${cmd.type}${fmt(cmd.point!.y)}`;
      case "C":
        return `${cmd.type}${fmt(cmd.cp1!.x)} ${fmt(cmd.cp1!.y)} ${fmt(cmd.cp2!.x)} ${fmt(cmd.cp2!.y)} ${fmt(cmd.point!.x)} ${fmt(cmd.point!.y)}`;
      case "S":
        return `${cmd.type}${fmt(cmd.cp1!.x)} ${fmt(cmd.cp1!.y)} ${fmt(cmd.point!.x)} ${fmt(cmd.point!.y)}`;
      case "Q":
        return `${cmd.type}${fmt(cmd.cp!.x)} ${fmt(cmd.cp!.y)} ${fmt(cmd.point!.x)} ${fmt(cmd.point!.y)}`;
      case "A":
        return `${cmd.type}${cmd.params!.map(fmt).join(" ")} ${fmt(cmd.point!.x)} ${fmt(cmd.point!.y)}`;
      case "Z":
        return cmd.type;
      default:
        return "";
    }
  }).join("");
}

function fmt(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

// ---------- Anchor points for overlay ----------

export function getAnchorPoints(commands: PathCommand[]): AnchorPoint[] {
  const abs = toAbsoluteCommands(commands);
  const anchors: AnchorPoint[] = [];
  let cx = 0, cy = 0;

  for (let i = 0; i < abs.length; i++) {
    const cmd = abs[i];
    const upper = cmd.type.toUpperCase();

    if (upper === "Z") {
      cx = anchors.length > 0 ? anchors[0].position.x : 0;
      cy = anchors.length > 0 ? anchors[0].position.y : 0;
      continue;
    }

    const anchor: AnchorPoint = {
      commandIndex: i,
      position: { x: 0, y: 0 },
    };

    switch (upper) {
      case "M":
      case "L":
      case "T":
        anchor.position = { ...cmd.point! };
        break;
      case "H":
        anchor.position = { x: cmd.point!.x, y: cy };
        break;
      case "V":
        anchor.position = { x: cx, y: cmd.point!.y };
        break;
      case "C":
        anchor.position = { ...cmd.point! };
        anchor.handleIn = { ...cmd.cp2! };
        // handleOut from previous command's cp1 is shown on prev anchor
        break;
      case "S":
        anchor.position = { ...cmd.point! };
        anchor.handleIn = { ...cmd.cp1! };
        break;
      case "Q":
        anchor.position = { ...cmd.point! };
        anchor.handleIn = { ...cmd.cp! };
        break;
      case "A":
        anchor.position = { ...cmd.point! };
        break;
    }

    // Attach handleOut from current command's cp1 to the PREVIOUS anchor
    if (upper === "C" && cmd.cp1 && anchors.length > 0) {
      const prev = anchors[anchors.length - 1];
      prev.handleOut = { ...cmd.cp1 };
    }
    if (upper === "Q" && cmd.cp && anchors.length > 0) {
      const prev = anchors[anchors.length - 1];
      prev.handleOut = { ...cmd.cp };
    }

    cx = anchor.position.x;
    cy = anchor.position.y;
    anchors.push(anchor);
  }

  return anchors;
}

// ---------- Update functions ----------

export function updateAnchorPosition(
  commands: PathCommand[],
  commandIndex: number,
  newPosition: Point
): PathCommand[] {
  const result = commands.map((c) => ({ ...c }));
  const cmd = result[commandIndex];
  if (!cmd) return result;

  const upper = cmd.type.toUpperCase();

  // For H/V, convert to L if dragged off-axis
  if (upper === "H") {
    const abs = toAbsoluteCommands(commands);
    const absCmd = abs[commandIndex];
    const prevY = findPrevY(abs, commandIndex);
    if (Math.abs(newPosition.y - prevY) > 0.5) {
      // Convert to L
      result[commandIndex] = {
        type: cmd.type === "h" ? "l" : "L",
        point: { x: newPosition.x, y: newPosition.y },
      };
    } else {
      result[commandIndex] = { ...cmd, point: { x: newPosition.x, y: absCmd?.point?.y ?? 0 } };
    }
    return result;
  }

  if (upper === "V") {
    const abs = toAbsoluteCommands(commands);
    const absCmd = abs[commandIndex];
    const prevX = findPrevX(abs, commandIndex);
    if (Math.abs(newPosition.x - prevX) > 0.5) {
      result[commandIndex] = {
        type: cmd.type === "v" ? "l" : "L",
        point: { x: newPosition.x, y: newPosition.y },
      };
    } else {
      result[commandIndex] = { ...cmd, point: { x: absCmd?.point?.x ?? 0, y: newPosition.y } };
    }
    return result;
  }

  // Calculate delta in absolute space
  const abs = toAbsoluteCommands(commands);
  const absCmd = abs[commandIndex];
  if (!absCmd?.point) return result;

  const dx = newPosition.x - absCmd.point.x;
  const dy = newPosition.y - absCmd.point.y;

  // Move the endpoint
  if (cmd.point) {
    if (cmd.type === cmd.type.toLowerCase() && cmd.type !== "z") {
      // Relative: just add delta to relative coords
      result[commandIndex] = {
        ...cmd,
        point: { x: cmd.point.x + dx, y: cmd.point.y + dy },
        // Move handles with the anchor to keep shape
        ...(cmd.cp1 ? { cp1: { x: cmd.cp1.x + dx, y: cmd.cp1.y + dy } } : {}),
        ...(cmd.cp2 ? { cp2: { x: cmd.cp2.x + dx, y: cmd.cp2.y + dy } } : {}),
        ...(cmd.cp ? { cp: { x: cmd.cp.x + dx, y: cmd.cp.y + dy } } : {}),
      };
    } else {
      result[commandIndex] = {
        ...cmd,
        point: { x: newPosition.x, y: newPosition.y },
        ...(cmd.cp1 ? { cp1: { x: cmd.cp1.x + dx, y: cmd.cp1.y + dy } } : {}),
        ...(cmd.cp2 ? { cp2: { x: cmd.cp2.x + dx, y: cmd.cp2.y + dy } } : {}),
        ...(cmd.cp ? { cp: { x: cmd.cp.x + dx, y: cmd.cp.y + dy } } : {}),
      };
    }
  }

  return result;
}

export function updateHandlePosition(
  commands: PathCommand[],
  commandIndex: number,
  handleType: "in" | "out",
  newPosition: Point
): PathCommand[] {
  const result = commands.map((c) => ({ ...c }));
  const cmd = result[commandIndex];
  if (!cmd) return result;

  const upper = cmd.type.toUpperCase();
  const isRel = cmd.type === cmd.type.toLowerCase() && cmd.type !== "z";

  if (handleType === "in") {
    // handleIn = cp2 for C, cp1 for S, cp for Q
    if (upper === "C" && cmd.cp2) {
      const pos = isRel ? relativeize(commands, commandIndex, newPosition) : newPosition;
      result[commandIndex] = { ...cmd, cp2: { x: pos.x, y: pos.y } };
    } else if (upper === "S" && cmd.cp1) {
      const pos = isRel ? relativeize(commands, commandIndex, newPosition) : newPosition;
      result[commandIndex] = { ...cmd, cp1: { x: pos.x, y: pos.y } };
    } else if (upper === "Q" && cmd.cp) {
      const pos = isRel ? relativeize(commands, commandIndex, newPosition) : newPosition;
      result[commandIndex] = { ...cmd, cp: { x: pos.x, y: pos.y } };
    }
  } else {
    // handleOut = cp1 of the NEXT C command, or cp of the next Q command
    // But handleOut is displayed on the current anchor, which means it's actually
    // cp1 of the command at commandIndex + 1 (if that command is C)
    // OR cp of commandIndex + 1 (if Q)
    const nextIdx = commandIndex + 1;
    if (nextIdx < result.length) {
      const nextCmd = result[nextIdx];
      const nextUpper = nextCmd.type.toUpperCase();
      const nextIsRel = nextCmd.type === nextCmd.type.toLowerCase();

      if (nextUpper === "C" && nextCmd.cp1) {
        const pos = nextIsRel ? relativeize(commands, nextIdx, newPosition) : newPosition;
        result[nextIdx] = { ...nextCmd, cp1: { x: pos.x, y: pos.y } };
      } else if (nextUpper === "Q" && nextCmd.cp) {
        const pos = nextIsRel ? relativeize(commands, nextIdx, newPosition) : newPosition;
        result[nextIdx] = { ...nextCmd, cp: { x: pos.x, y: pos.y } };
      }
    }
  }

  return result;
}

// ---------- Helpers ----------

function relativeize(commands: PathCommand[], commandIndex: number, absPoint: Point): Point {
  const abs = toAbsoluteCommands(commands);
  let prevX = 0, prevY = 0;
  for (let i = commandIndex - 1; i >= 0; i--) {
    const p = abs[i];
    if (p.point) {
      const upper = p.type.toUpperCase();
      if (upper === "H") {
        prevX = p.point.x;
        // need to find prevY from earlier
        for (let j = i - 1; j >= 0; j--) {
          const pp = abs[j];
          if (pp.type.toUpperCase() !== "H" && pp.point) {
            prevY = pp.type.toUpperCase() === "V" ? pp.point.y : pp.point.y;
            break;
          }
        }
        break;
      } else if (upper === "V") {
        prevY = p.point.y;
        for (let j = i - 1; j >= 0; j--) {
          const pp = abs[j];
          if (pp.type.toUpperCase() !== "V" && pp.point) {
            prevX = pp.type.toUpperCase() === "H" ? pp.point.x : pp.point.x;
            break;
          }
        }
        break;
      } else {
        prevX = p.point.x;
        prevY = p.point.y;
        break;
      }
    }
  }
  return { x: absPoint.x - prevX, y: absPoint.y - prevY };
}

function findPrevY(abs: PathCommand[], index: number): number {
  for (let i = index - 1; i >= 0; i--) {
    const cmd = abs[i];
    const upper = cmd.type.toUpperCase();
    if (upper === "V" && cmd.point) return cmd.point.y;
    if (upper !== "H" && cmd.point) return cmd.point.y;
  }
  return 0;
}

function findPrevX(abs: PathCommand[], index: number): number {
  for (let i = index - 1; i >= 0; i--) {
    const cmd = abs[i];
    const upper = cmd.type.toUpperCase();
    if (upper === "H" && cmd.point) return cmd.point.x;
    if (upper !== "V" && cmd.point) return cmd.point.x;
  }
  return 0;
}
