/**
 * @param targetX - Target X relative to the shoulder
 * @param targetY - Target Y relative to the shoulder
 * @param L1 - Length of Upper Arm
 * @param L2 - Length of Lower Arm
 * @param invert - Flip the elbow direction (1 or -1)
 */
export const solveIK = (targetX: number, targetY: number, L1: number, L2: number, invert = 1) => {
    const distSq = targetX * targetX + targetY * targetY;
    const dist = Math.sqrt(distSq);
    const maxDist = L1 + L2 - 0.1;
    
    let tx = targetX;
    let ty = targetY;
    if (dist > maxDist) {
        const scale = maxDist / dist;
        tx *= scale;
        ty *= scale;
    }

    const d2 = tx * tx + ty * ty;
    const d = Math.sqrt(d2);

    const cosA = (L1 * L1 + d2 - L2 * L2) / (2 * L1 * d);
    const angleA = Math.atan2(ty, tx) - Math.acos(Math.max(-1, Math.min(1, cosA))) * invert;

    const cosB = (L1 * L1 + L2 * L2 - d2) / (2 * L1 * L2);
    const angleB = Math.PI - Math.acos(Math.max(-1, Math.min(1, cosB))) * invert;

    return {
        upperRotation: angleA * (180 / Math.PI),
        lowerRotation: angleB * (180 / Math.PI),
    };
};