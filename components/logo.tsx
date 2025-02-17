'use client'
import React, { useRef } from 'react';
// import html2canvas from 'html2canvas';

export default function Logo() {
    const svgRef = useRef(null);
    const containerRef = useRef(null);

    // const exportToPng = () => {
    //     if (!containerRef.current) {
    //         console.error('Container element not found');
    //         return;
    //     }

    //     html2canvas(containerRef.current).then((canvas) => {
    //         const image = canvas.toDataURL('image/png');
    //         const link = document.createElement('a');
    //         link.href = image;
    //         link.download = 'logo-export.png';
    //         link.click();
    //     });
    // };

    const exportToSvg = () => {
        if (!svgRef.current || !containerRef.current) {
            console.error('SVG or container element not found');
            return;
        }

        // Get computed styles
        const computedSvgStyle = getComputedStyle(svgRef.current);
        const computedContainerStyle = getComputedStyle(containerRef.current);

        // Parse dimensions
        const containerWidth = parseFloat(computedContainerStyle.width);
        const containerHeight = parseFloat(computedContainerStyle.height);
        const paddingTop = parseFloat(computedContainerStyle.paddingTop);
        const paddingRight = parseFloat(computedContainerStyle.paddingRight);
        const paddingBottom = parseFloat(computedContainerStyle.paddingBottom);
        const paddingLeft = parseFloat(computedContainerStyle.paddingLeft);

        // Calculate content dimensions
        const contentWidth = containerWidth - paddingLeft - paddingRight;
        const contentHeight = containerHeight - paddingTop - paddingBottom;

        // Create a new SVG element
        const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        newSvg.setAttribute('xmlns', "http://www.w3.org/2000/svg");
        newSvg.setAttribute('width', `${containerWidth}`);
        newSvg.setAttribute('height', `${containerHeight}`);
        newSvg.setAttribute('viewBox', `0 0 ${containerWidth} ${containerHeight}`);

        // Create a clip path for rounded corners
        const clipPath = document.createElementNS("http://www.w3.org/2000/svg", "clipPath");
        clipPath.setAttribute('id', 'rounded-corners');
        const clipRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        clipRect.setAttribute('width', '100%');
        clipRect.setAttribute('height', '100%');
        clipRect.setAttribute('rx', computedContainerStyle.borderTopLeftRadius);
        clipRect.setAttribute('ry', computedContainerStyle.borderTopLeftRadius);
        clipPath.appendChild(clipRect);

        // Create background rect
        const bgRect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        bgRect.setAttribute('width', '100%');
        bgRect.setAttribute('height', '100%');
        bgRect.style.fill = computedContainerStyle.backgroundColor;

        // Clone the original SVG content
        const originalContent = (svgRef.current as any).cloneNode(true);
        originalContent.style.fill = computedSvgStyle.fill;
        
        // Set position and size of the original content
        originalContent.setAttribute('x', `${paddingLeft}`);
        originalContent.setAttribute('y', `${paddingTop}`);
        originalContent.setAttribute('width', `${contentWidth}`);
        originalContent.setAttribute('height', `${contentHeight}`);

        // Create a group to hold the background and logo
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.setAttribute('clip-path', 'url(#rounded-corners)');
        group.appendChild(bgRect);
        group.appendChild(originalContent);

        // Append elements to the new SVG
        newSvg.appendChild(clipPath);
        newSvg.appendChild(group);

        // Serialize and export
        const svgData = new XMLSerializer().serializeToString(newSvg);
        const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
        const svgUrl = URL.createObjectURL(svgBlob);

        const link = document.createElement('a');
        link.href = svgUrl;
        link.download = 'logo-export.svg';
        link.click();

        URL.revokeObjectURL(svgUrl);
    };

    return (
        <div className="w-screen h-screen flex flex-col items-center justify-center">
            <div ref={containerRef} className="logo-container w-auto h-auto bg-primary p-8 rounded-[80px]">
                <svg
                    ref={svgRef}
                    id="Layer_2"
                    data-name="Layer 2"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    className="h-96 w-96 fill-[#ffffff]"
                >
                    <rect
                        x="120.1"
                        y="9.9"
                        width="13.5"
                        height="240"
                        transform="translate(-49.1 174.4) rotate(-59.9)"
                        style={{ strokeWidth: '50' }}
                    />
                    <rect
                        x="8.4"
                        y="120.9"
                        width="238.9"
                        height="13.5"
                        transform="translate(0 255.2) rotate(-89.9)"
                    />
                    <rect
                        x="8"
                        y="121.7"
                        width="238.5"
                        height="13.5"
                        transform="translate(-47.1 80.5) rotate(-29.9)"
                    />
                    <path
                        d="M240.5,75.3h0l-.2,106.1c0,7.4-4,14.2-10.4,17.9l-92,52.8c-6.4,3.7-14.3,3.6-20.7,0l-91.7-53.3c-6.4-3.7-10.3-10.6-10.3-17.9h0l.2-106.1c0-7.4,4-14.2,10.4-17.9L117.8,4.1c6.4-3.7,14.3-3.6,20.7,0h0l91.8,53.2c6.4,3.7,10.3,10.6,10.3,17.9h0ZM28.7,181c0,2.5,1.4,4.9,3.6,6.2l91.8,53.2c2.2,1.3,4.9,1.3,7.2,0l92-52.8c2.2-1.3,3.6-3.6,3.6-6.2l.2-106.1h0c0-2.6-1.4-4.9-3.6-6.2L131.7,15.9c-2.2-1.3-4.9-1.3-7.2,0l-92,52.8c-2.2,1.3-3.6,3.6-3.6,6.2l-.2,106.1h0Z"
                        
                    />
                </svg>
            </div>
            <div className="mt-4 space-x-4">
                {/* <button 
                    onClick={exportToPng}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Export to PNG
                </button> */}
                <button 
                    onClick={exportToSvg}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Export to SVG
                </button>
            </div>
        </div>
    );
}