"use client"

import { useEffect, useRef, useCallback } from "react"

interface Pixel {
  x: number
  y: number
  intensity: number
  targetIntensity: number
  baseIntensity: number
}

export function LEDBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const pixelsRef = useRef<Pixel[]>([])
  const dimensionsRef = useRef({ width: 0, height: 0, cols: 0, rows: 0 })
  const sceneRef = useRef(0) // Adicionado controle de cenas
  const scrollOffsetRef = useRef(0)

  const PIXEL_SIZE = 5
  const PIXEL_GAP = 1
  const GRID_SIZE = PIXEL_SIZE + PIXEL_GAP
  const SCROLL_SPEED = 0.5

  const initializePixels = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const width = window.innerWidth
    const height = window.innerHeight

    canvas.width = width
    canvas.height = height

    const cols = Math.floor(width / GRID_SIZE)
    const rows = Math.floor(height / GRID_SIZE)

    dimensionsRef.current = { width, height, cols, rows }

    const pixels: Pixel[] = []

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        pixels.push({
          x: col * GRID_SIZE + PIXEL_SIZE / 2,
          y: row * GRID_SIZE + PIXEL_SIZE / 2,
          intensity: Math.random() * 0.3 + 0.1,
          targetIntensity: Math.random() * 0.3 + 0.1,
          baseIntensity: Math.random() * 0.2 + 0.1,
        })
      }
    }

    pixelsRef.current = pixels
  }, [])

  const drawPyramids = useCallback(() => {
    const pixels = pixelsRef.current
    const { cols, rows } = dimensionsRef.current
    const time = Date.now() * 0.001

    pixels.forEach((pixel, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)

      pixel.targetIntensity = pixel.baseIntensity * 0.3

      // Pirâmide principal (centro-esquerda)
      const pyramidCenterX = cols * 0.3
      const pyramidBaseY = rows * 0.8
      const pyramidHeight = rows * 0.4
      const pyramidWidth = cols * 0.2

      // Verificar se o pixel está dentro da pirâmide
      const distFromCenter = Math.abs(col - pyramidCenterX)
      const heightFromBase = pyramidBaseY - row
      const maxWidthAtHeight = (pyramidWidth / 2) * (1 - heightFromBase / pyramidHeight)

      if (heightFromBase > 0 && heightFromBase < pyramidHeight && distFromCenter < maxWidthAtHeight) {
        const intensity = 0.8 + Math.sin(time * 3 + row * 0.1) * 0.2
        pixel.targetIntensity = Math.max(pixel.targetIntensity, intensity)
      }

      // Pirâmide menor (centro-direita)
      const pyramid2CenterX = cols * 0.6
      const pyramid2BaseY = rows * 0.8
      const pyramid2Height = rows * 0.3
      const pyramid2Width = cols * 0.15

      const distFromCenter2 = Math.abs(col - pyramid2CenterX)
      const heightFromBase2 = pyramid2BaseY - row
      const maxWidthAtHeight2 = (pyramid2Width / 2) * (1 - heightFromBase2 / pyramid2Height)

      if (heightFromBase2 > 0 && heightFromBase2 < pyramid2Height && distFromCenter2 < maxWidthAtHeight2) {
        const intensity = 0.7 + Math.sin(time * 2.5 + row * 0.1) * 0.2
        pixel.targetIntensity = Math.max(pixel.targetIntensity, intensity)
      }

      // Esfinge (lado direito)
      const sphinxCenterX = cols * 0.8
      const sphinxCenterY = rows * 0.7
      const sphinxWidth = cols * 0.1
      const sphinxHeight = rows * 0.15

      if (Math.abs(col - sphinxCenterX) < sphinxWidth && Math.abs(row - sphinxCenterY) < sphinxHeight) {
        const intensity = 0.6 + Math.sin(time * 4 + col * 0.1) * 0.3
        pixel.targetIntensity = Math.max(pixel.targetIntensity, intensity)
      }

      // Estrelas no céu
      if (row < rows * 0.3 && Math.random() < 0.001) {
        pixel.targetIntensity = Math.max(pixel.targetIntensity, 0.9)
      }

      // Dunas de areia (ondulações na base)
      const duneWave = Math.sin(col * 0.02 + time * 2) * 8 + rows * 0.85 - 10
      if (row > duneWave && row < rows * 0.9) {
        pixel.targetIntensity = Math.max(pixel.targetIntensity, 0.3)
      }
    })
  }, [])

  const drawTutankhamun = useCallback(() => {
    const pixels = pixelsRef.current
    const { cols, rows } = dimensionsRef.current
    const time = Date.now() * 0.0015

    pixels.forEach((pixel, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)

      pixel.targetIntensity = pixel.baseIntensity * 0.2

      const centerX = cols * 0.5
      const centerY = rows * 0.4

      // Máscara de Tutankhamun (formato oval para o rosto)
      const faceWidth = cols * 0.15
      const faceHeight = rows * 0.25
      const distX = (col - centerX) / faceWidth
      const distY = (row - centerY) / faceHeight

      if (distX * distX + distY * distY < 1) {
        const intensity = 0.8 + Math.sin(time * 2 + row * 0.1) * 0.2
        pixel.targetIntensity = Math.max(pixel.targetIntensity, intensity)
      }

      // Coroa/Nemes (parte superior triangular)
      const crownCenterY = rows * 0.25
      const crownHeight = rows * 0.2
      const crownWidth = cols * 0.2
      const crownDistX = Math.abs(col - centerX)
      const crownDistY = crownCenterY - row

      if (crownDistY > 0 && crownDistY < crownHeight) {
        const maxWidth = (crownWidth / 2) * (1 - crownDistY / crownHeight)
        if (crownDistX < maxWidth) {
          const intensity = 0.9 + Math.sin(time * 3 + col * 0.1) * 0.1
          pixel.targetIntensity = Math.max(pixel.targetIntensity, intensity)
        }
      }

      // Olhos
      const eyeY = rows * 0.38
      const leftEyeX = cols * 0.45
      const rightEyeX = cols * 0.55
      const eyeSize = cols * 0.02

      if (
        (Math.abs(col - leftEyeX) < eyeSize && Math.abs(row - eyeY) < eyeSize) ||
        (Math.abs(col - rightEyeX) < eyeSize && Math.abs(row - eyeY) < eyeSize)
      ) {
        pixel.targetIntensity = Math.max(pixel.targetIntensity, 1.0)
      }

      // Colar/ornamentos (linhas horizontais)
      const collarY = rows * 0.55
      if (Math.abs(row - collarY) < 3 && Math.abs(col - centerX) < cols * 0.2) {
        const intensity = 0.7 + Math.sin(time * 4 + col * 0.2) * 0.3
        pixel.targetIntensity = Math.max(pixel.targetIntensity, intensity)
      }

      // Hieróglifos ao redor (padrões decorativos)
      if ((col < cols * 0.2 || col > cols * 0.8) && row > rows * 0.2 && row < rows * 0.8) {
        const hieroglyphPattern = Math.sin(row * 0.3 + time) * Math.cos(col * 0.2 + time * 1.5)
        if (hieroglyphPattern > 0.3) {
          const intensity = 0.4 + hieroglyphPattern * 0.3
          pixel.targetIntensity = Math.max(pixel.targetIntensity, intensity)
        }
      }
    })
  }, [])

  const createSideScrollerScene = useCallback(() => {
    const pixels = pixelsRef.current
    const { cols, rows } = dimensionsRef.current
    const time = Date.now() * 0.001

    scrollOffsetRef.current += SCROLL_SPEED

    pixels.forEach((pixel, index) => {
      const col = index % cols
      const row = Math.floor(index / cols)

      pixel.targetIntensity = pixel.baseIntensity * 0.1

      const worldX = col + scrollOffsetRef.current * 0.1

      const groundLevel = rows * 0.85
      const dune1 = Math.sin(worldX * 0.015) * 12 + groundLevel - 20
      const dune2 = Math.sin(worldX * 0.025 + 1.5) * 8 + groundLevel - 10
      const dune3 = Math.sin(worldX * 0.035 + 3) * 6 + groundLevel - 5

      if (row >= Math.min(dune1, dune2, dune3, groundLevel)) {
        const depth = row - Math.min(dune1, dune2, dune3)
        const intensity = Math.max(0.2, 0.5 - depth * 0.02)
        pixel.targetIntensity = Math.max(pixel.targetIntensity, intensity)
      }

      const templeSpacing = 150
      const templePhase = Math.floor(worldX / templeSpacing)
      const templeX = (worldX % templeSpacing) - templeSpacing * 0.3

      if (templePhase % 4 === 0) {
        // Templo com colunas
        const templeBase = groundLevel - 5
        const templeHeight = rows * 0.35
        const templeWidth = 60
        const templeCenterX = 40

        // Base do templo
        if (
          Math.abs(templeX - templeCenterX) < templeWidth / 2 &&
          row > templeBase - templeHeight &&
          row < templeBase
        ) {
          // Colunas (4 colunas principais)
          for (let i = 0; i < 4; i++) {
            const columnX = templeCenterX - 20 + i * 13
            const columnWidth = 3
            if (Math.abs(templeX - columnX) < columnWidth) {
              const intensity = 0.7 + Math.sin(time * 2 + i) * 0.2
              pixel.targetIntensity = Math.max(pixel.targetIntensity, intensity)
            }
          }

          // Teto do templo
          if (row < templeBase - templeHeight + 8) {
            pixel.targetIntensity = Math.max(pixel.targetIntensity, 0.8)
          }

          // Hieróglifos nas paredes
          if ((templeX + row + time * 10) % 12 < 3) {
            pixel.targetIntensity = Math.max(pixel.targetIntensity, 0.9)
          }
        }
      }

      if (templePhase % 4 === 1) {
        const pyramidCenterX = 50
        const pyramidBase = groundLevel - 8
        const pyramidHeight = rows * 0.45
        const pyramidWidth = 70

        const distFromCenter = Math.abs(templeX - pyramidCenterX)
        const heightFromBase = pyramidBase - row
        const maxWidthAtHeight = (pyramidWidth / 2) * (1 - heightFromBase / pyramidHeight)

        if (heightFromBase > 0 && heightFromBase < pyramidHeight && distFromCenter < maxWidthAtHeight) {
          // Blocos de pedra (textura)
          const blockPattern = Math.floor(row / 4) + Math.floor(templeX / 6)
          const blockIntensity = 0.6 + (blockPattern % 3) * 0.1

          // Entrada da pirâmide
          if (Math.abs(templeX - pyramidCenterX) < 4 && heightFromBase < 15) {
            pixel.targetIntensity = Math.max(pixel.targetIntensity, 0.3)
          } else {
            pixel.targetIntensity = Math.max(pixel.targetIntensity, blockIntensity)
          }
        }
      }

      if (templePhase % 4 === 2) {
        const caravanY = groundLevel - 15
        for (let camel = 0; camel < 3; camel++) {
          const camelX = 20 + camel * 25 + Math.sin(time + camel) * 2
          const camelBody = 8
          const camelHeight = 12

          // Corpo do camelo
          if (Math.abs(templeX - camelX) < camelBody && Math.abs(row - caravanY) < camelHeight / 2) {
            pixel.targetIntensity = Math.max(pixel.targetIntensity, 0.7)
          }

          // Corcova
          if (Math.abs(templeX - camelX) < 4 && Math.abs(row - (caravanY - 8)) < 3) {
            pixel.targetIntensity = Math.max(pixel.targetIntensity, 0.8)
          }

          // Pescoço e cabeça
          if (Math.abs(templeX - (camelX + 6)) < 2 && Math.abs(row - (caravanY - 6)) < 6) {
            pixel.targetIntensity = Math.max(pixel.targetIntensity, 0.7)
          }
        }
      }

      if (templePhase % 4 === 3) {
        const oasisCenterX = 35
        const oasisY = groundLevel - 5

        // Lago do oásis (forma orgânica)
        const lakeRadius = 15 + Math.sin(time * 2) * 2
        const distToLake = Math.sqrt((templeX - oasisCenterX) ** 2 + (row - oasisY) ** 2)
        if (distToLake < lakeRadius) {
          const ripple = Math.sin(distToLake * 0.5 - time * 4) * 0.2
          pixel.targetIntensity = Math.max(pixel.targetIntensity, 0.4 + ripple)
        }

        // Palmeiras ao redor do oásis
        for (let palm = 0; palm < 4; palm++) {
          const palmAngle = (palm / 4) * Math.PI * 2
          const palmX = oasisCenterX + Math.cos(palmAngle) * 20
          const palmY = oasisY - 25

          // Tronco da palmeira
          if (Math.abs(templeX - palmX) < 2 && row > palmY && row < oasisY) {
            pixel.targetIntensity = Math.max(pixel.targetIntensity, 0.6)
          }

          // Folhas da palmeira (padrão radial)
          const distToPalm = Math.sqrt((templeX - palmX) ** 2 + (row - palmY) ** 2)
          if (distToPalm < 12 && distToPalm > 8) {
            const leafAngle = Math.atan2(row - palmY, templeX - palmX)
            if (Math.sin(leafAngle * 4 + palm) > 0.3) {
              pixel.targetIntensity = Math.max(pixel.targetIntensity, 0.5)
            }
          }
        }
      }

      // Lua cheia fixa no céu
      const moonX = cols * 0.15
      const moonY = rows * 0.15
      const moonRadius = 8
      const distToMoon = Math.sqrt((col - moonX) ** 2 + (row - moonY) ** 2)

      if (distToMoon < moonRadius) {
        // Criar lua cheia (círculo completo)
        const intensity = 1.0 - (distToMoon / moonRadius) * 0.4
        pixel.targetIntensity = Math.max(pixel.targetIntensity, intensity)
      }

      // Estrelas formando constelações
      const starSeed = Math.sin(col * 12.9898 + row * 78.233) * 43758.5453
      const starNoise = starSeed - Math.floor(starSeed)

      if (starNoise > 0.995 && row < rows * 0.7) {
        const twinkle = Math.sin(time * 3 + col * 0.1 + row * 0.1) * 0.3 + 0.7
        pixel.targetIntensity = Math.max(pixel.targetIntensity, twinkle)
      }

      const mistHeight = rows * 0.7
      if (row > mistHeight) {
        const mistIntensity = Math.sin(worldX * 0.02 + time * 0.5) * 0.1 + 0.1
        const mistFade = (row - mistHeight) / (rows - mistHeight)
        pixel.targetIntensity = Math.max(pixel.targetIntensity, mistIntensity * mistFade)
      }
    })
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    createSideScrollerScene()

    const pixels = pixelsRef.current

    ctx.fillStyle = "#001122"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    pixels.forEach((pixel) => {
      pixel.intensity += (pixel.targetIntensity - pixel.intensity) * 0.12
      pixel.targetIntensity *= 0.98

      if (pixel.intensity > 0.02) {
        const alpha = Math.min(pixel.intensity, 1)

        if (pixel.intensity < 0.3) {
          ctx.fillStyle = `rgba(0, 77, 77, ${alpha})` // Cyan escuro
        } else if (pixel.intensity < 0.6) {
          ctx.fillStyle = `rgba(0, 139, 139, ${alpha})` // Cyan médio
        } else if (pixel.intensity < 0.8) {
          ctx.fillStyle = `rgba(0, 191, 191, ${alpha})` // Cyan claro
        } else {
          ctx.fillStyle = `rgba(0, 255, 255, ${alpha})` // Cyan brilhante
        }

        ctx.fillRect(pixel.x - PIXEL_SIZE / 2, pixel.y - PIXEL_SIZE / 2, PIXEL_SIZE, PIXEL_SIZE)
      }
    })

    animationRef.current = requestAnimationFrame(animate)
  }, [createSideScrollerScene])

  useEffect(() => {
    initializePixels()
    animate()

    const handleResize = () => {
      initializePixels()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", handleResize)
    }
  }, [initializePixels, animate])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full -z-10" style={{ background: "#001122" }} />
}
