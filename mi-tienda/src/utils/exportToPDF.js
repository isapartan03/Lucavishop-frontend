import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const exportToPDF = async (elementId, filename = 'reporte.pdf') => {
    const originalElement = document.getElementById(elementId)
    if (!originalElement) {
        console.error('Elemento no encontrado')
        return
    }

    const clone = originalElement.cloneNode(true)
    clone.style.position = 'absolute'
    clone.style.top = '-9999px'
    clone.style.left = '-9999px'
    // Forzamos un ancho fijo para que el diseño sea predecible en el PDF
    clone.style.width = '1200px'
    clone.style.background = '#ffffff'
    document.body.appendChild(clone)

    const style = document.createElement('style')
    style.textContent = `
        * {
            background-color: #ffffff !important;
            color: #000000 !important;
            border-color: #cccccc !important;
            box-shadow: none !important;
            text-shadow: none !important;
            font-size: 12px !important; /* Ajusta el tamaño de fuente si sale muy grande */
        }
         
        
        table, th, td { border: 1px solid #ddd !important; }

    `
    clone.appendChild(style)

    // ... (Tu código de espera de canvas se mantiene igual) ...

    try {
        const canvas = await html2canvas(clone, {
            scale: 2, // 2 es suficiente para buena calidad sin exagerar el peso
            backgroundColor: '#ffffff',
            useCORS: true,
            logging: false,
        })

        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'letter',
        })

        const pageWidth = pdf.internal.pageSize.getWidth()
        const pageHeight = pdf.internal.pageSize.getHeight()
        const margin = 10

        // El ancho de la imagen en el PDF será el ancho de la página menos márgenes
        const imgWidth = pageWidth - margin * 2
        // Calculamos el alto proporcional que tendrá esa imagen en el PDF
        const imgHeightInPdf = (canvas.height * imgWidth) / canvas.width

        const contentHeightPerPage = pageHeight - margin * 2
        let heightLeft = imgHeightInPdf
        let position = margin // Posición inicial con margen superior

        // Primera página
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeightInPdf)
        heightLeft -= contentHeightPerPage

        // Páginas adicionales si el contenido es largo
        while (heightLeft > 0) {
            position = heightLeft - imgHeightInPdf + margin
            pdf.addPage()
            pdf.addImage(
                imgData,
                'PNG',
                margin,
                position,
                imgWidth,
                imgHeightInPdf,
            )
            heightLeft -= contentHeightPerPage
        }

        pdf.save(filename)
    } catch (error) {
        console.error('Error al generar PDF:', error)
    } finally {
        document.body.removeChild(clone)
    }
}
