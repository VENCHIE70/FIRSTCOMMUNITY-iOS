import zlib
import struct
import math

def create_png(width, height, is_maskable=False):
    raw_data = bytearray()
    
    # Pre-calculate center and radii
    cx, cy = width / 2.0, height / 2.0
    r_max = min(width, height) / 2.0
    
    for y in range(height):
        raw_data.append(0) # Filter None
        ny = (y - cy) / (height / 2.0)
        for x in range(width):
            nx = (x - cx) / (width / 2.0)
            dist_sq = nx * nx + ny * ny
            dist = math.sqrt(dist_sq)
            
            # Corner radius for squircle if not maskable
            in_bounds = True
            if not is_maskable:
                # Rounded rect
                px = abs(x - cx)
                py = abs(y - cy)
                limit_x = (width / 2.0) - (width * 0.18)
                limit_y = (height / 2.0) - (height * 0.18)
                rad = width * 0.18
                if px > limit_x and py > limit_y:
                    corner_d = math.sqrt((px - limit_x)**2 + (py - limit_y)**2)
                    if corner_d > rad:
                        in_bounds = False
            
            if not in_bounds:
                raw_data.extend([0, 0, 0, 0])
                continue
                
            # Base background gradient (Deep blue to navy)
            t = (y / height) * 0.7 + (x / width) * 0.3
            r = int(26 * (1 - t) + 15 * t)
            g = int(58 * (1 - t) + 23 * t)
            b = int(138 * (1 - t) + 42 * t)
            a = 255
            
            # Scale inside safe zone if maskable
            scale = 0.75 if is_maskable else 1.0
            snx = nx / scale
            sny = ny / scale
            
            # White Cross in center
            # Vertical bar: snx in [-0.04, 0.04], sny in [-0.5, 0.15]
            # Horizontal bar: snx in [-0.22, 0.22], sny in [-0.32, -0.22]
            is_cross = False
            if -0.04 <= snx <= 0.04 and -0.50 <= sny <= 0.15:
                is_cross = True
            elif -0.22 <= snx <= 0.22 and -0.32 <= sny <= -0.22:
                is_cross = True
                
            if is_cross:
                r, g, b = 255, 255, 255
            else:
                # Golden Bible / Book arch below cross
                # sny in [0.05, 0.45]
                if 0.05 <= sny <= 0.42 and abs(snx) <= 0.42:
                    curve = 0.08 * math.cos(snx * 3.14159 * 2.5)
                    if abs(sny - 0.22 - curve) < 0.16 and abs(snx) > 0.015:
                        # Gold color
                        gold_t = (snx + 0.42) / 0.84
                        r = int(250 * (1 - gold_t * 0.2))
                        g = int(204 - 30 * gold_t)
                        b = int(21 + 20 * gold_t)
                        
            raw_data.extend([r, g, b, a])
            
    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    ihdr = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', zlib.compress(bytes(raw_data), 6)) + chunk(b'IEND', b'')

with open('public/pwa-192x192.png', 'wb') as f:
    f.write(create_png(192, 192, False))
with open('public/pwa-512x512.png', 'wb') as f:
    f.write(create_png(512, 512, False))
with open('public/pwa-maskable-512x512.png', 'wb') as f:
    f.write(create_png(512, 512, True))
with open('public/apple-touch-icon.png', 'wb') as f:
    f.write(create_png(180, 180, False))

print("PWA icons generated successfully!")
