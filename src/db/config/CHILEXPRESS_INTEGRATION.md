// Integración de Chilexpress en Envios_Front
// =========================================

// 1. SERVICIOS DISPONIBLES:
//
//    chilexpress.service.ts:
//    - getChilexpressRegions() - Obtiene todas las regiones
//    - getChilexpressCoverageAreas(regionCode) - Obtiene áreas de cobertura
//    - findChilexpressCountyByName(communeName) - Busca condado por nombre
//    - clearChilexpressCache() - Limpia caches
//
//    postal.service.ts:
//    - quoteShipping(body) - Cotiza envío (soporta DPA y Chilexpress)
//    - createDelivery(payload) - Crea delivery

// 2. HOOKS DISPONIBLES:
//
//    useChilexpress() en QuotePage:
//    - regions: ChilexpressRegion[] - Regiones de Chilexpress
//    - coverageAreas: Map<string, ChilexpressCoverageArea[]> - Áreas por región
//    - loadCoverageAreas(regionCode) - Carga áreas de una región
//    - findCountyByName(name) - Busca condado por nombre

// 3. FLUJO DE COTIZACIÓN CON CHILEXPRESS:
//
//    A. Legacy (con códigos DPA):
//       QuotePage → quoteShipping({
//         originCommuneId: "13101",      // Código DPA
//         destinationCommuneId: "05109", // Código DPA
//         ...package, productType, etc
//       }) → Backend mapea a countyCode automáticamente

//    B. Moderno (con countyCode de Chilexpress):
//       1. Obtener regiones: GET /geo/chilexpress/regions
//       2. Obtener áreas: GET /geo/chilexpress/coverage-areas?regionCode=RM
//       3. Enviar cotización con: {
//          originCountyCode: "STGO",
//          destinationCountyCode: "VAP",
//          ...
//       } (tiene prioridad sobre DPA codes)

// 4. DATOS DE CHILEXPRESS EN CACHÉ:
//
//    Los datos se cachean automáticamente en:
//    - _regionsCache (chilexpress.service.ts)
//    - _coverageCache (chilexpress.service.ts)
//    
//    Limpiar con: clearChilexpressCache()

// 5. TIPOS:
//
//    QuoteRequest: Soporta ambos formatos
//    - originCommuneId?, destinationCommuneId? (DPA)
//    - originCountyCode?, destinationCountyCode? (Chilexpress)
//    
//    ChilexpressRegion: {regionId, regionName, regionCode}
//    ChilexpressCoverageArea: {countyCode, countyName, coverageAreaId, coverageAreaName}

// 6. ERRORES COMUNES:
//
//    "API Key de Chilexpress no configurada":
//    → El backend no tiene CARRIERS_JSON en .env
//    
//    "Los códigos DPA ya no están soportados":
//    → Backend rechaza solo DPA sin originCountyCode/destinationCountyCode
//    
//    "Error obteniendo regiones de Chilexpress":
//    → /geo/chilexpress/regions no está disponible o hay problema de red
