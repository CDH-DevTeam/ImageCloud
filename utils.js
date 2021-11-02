export function scale (m, max=20, min=-20)  {
    // Assumes data is scaled between [0,1]
    return m * (max-min) + min
}