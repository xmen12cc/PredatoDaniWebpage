document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const promptInput = document.getElementById('prompt');
    const widthInput = document.getElementById('width');
    const heightInput = document.getElementById('height');
    const statusMessage = document.getElementById('statusMessage');
    const generatedImage = document.getElementById('generatedImage');
    const costTracker = document.getElementById('costTracker');
    const tokenUsageSpan = document.getElementById('tokenUsage');
    const estimatedCostSpan = document.getElementById('estimatedCost');
    const threeDSection = document.getElementById('threeDSection');
    const generate3DBtn = document.getElementById('generate3DBtn');
    const threeDResults = document.getElementById('threeDResults');

    let currentBlueprintBase64 = '';

    generateBtn.addEventListener('click', async () => {
        const prompt = promptInput.value.trim();
        const width = parseInt(widthInput.value);
        const height = parseInt(heightInput.value);

        if (!prompt) {
            alert('Please enter a prompt');
            return;
        }

        // Update UI for loading state
        generateBtn.disabled = true;
        statusMessage.textContent = 'Generating your plan blueprint...';
        generatedImage.style.display = 'none';
        costTracker.style.display = 'none';
        threeDSection.style.display = 'none';
        threeDResults.innerHTML = '';

        try {
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt,
                    width,
                    height
                }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const data = await response.json();

            // Handle the response
            if (data.success) {
                // Display the blueprint image
                if (data.imageUrl) {
                    generatedImage.src = data.imageUrl;
                    generatedImage.style.display = 'block';
                    currentBlueprintBase64 = data.imageUrl;
                    
                    // Force the 3D section to be visible
                    threeDSection.style.display = 'block';
                    threeDSection.style.opacity = '1';
                    threeDSection.style.visibility = 'visible';
                }
                
                // Display usage and cost
                if (data.usage) {
                    tokenUsageSpan.textContent = `${data.usage.totalTokens} tokens`;
                    estimatedCostSpan.textContent = `$${data.usage.estimatedCostUsd} USD`;
                    costTracker.style.display = 'block';
                }

                // Status message update
                statusMessage.textContent = 'Plan blueprint generated successfully!';
            } else {
                statusMessage.textContent = data.error || 'Unexpected response format from server.';
            }
        } catch (error) {
            console.error('Generation failed:', error);
            statusMessage.textContent = `Error: ${error.message}`;
        } finally {
            generateBtn.disabled = false;
        }
    });

    generate3DBtn.addEventListener('click', async () => {
        if (!currentBlueprintBase64) return;

        generate3DBtn.disabled = true;
        statusMessage.textContent = 'Generating 3D perspectives...';
        threeDResults.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">Processing 3D models (this may take a few moments)...</p>';

        try {
            const response = await fetch('/api/generate-3d', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageBase64: currentBlueprintBase64
                }),
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.success) {
                threeDResults.innerHTML = '';
                data.images.forEach((imgUrl, index) => {
                    const img = document.createElement('img');
                    img.src = imgUrl;
                    img.style.width = '100%';
                    img.style.borderRadius = '8px';
                    img.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
                    img.alt = `3D Perspective ${index + 1}`;
                    threeDResults.appendChild(img);
                });

                // Update cost tracker with cumulative or new cost
                if (data.usage) {
                    const prevTokens = parseInt(tokenUsageSpan.textContent) || 0;
                    const prevCost = parseFloat(estimatedCostSpan.textContent.replace('$', '')) || 0;
                    
                    tokenUsageSpan.textContent = `${prevTokens + data.usage.totalTokens} tokens (cumulative)`;
                    estimatedCostSpan.textContent = `$${(prevCost + parseFloat(data.usage.estimatedCostUsd)).toFixed(6)} USD (cumulative)`;
                }

                statusMessage.textContent = '3D models generated successfully!';
            } else {
                statusMessage.textContent = data.error || 'Failed to generate 3D models.';
            }
        } catch (error) {
            console.error('3D Generation failed:', error);
            statusMessage.textContent = `Error: ${error.message}`;
            threeDResults.innerHTML = '';
        } finally {
            generate3DBtn.disabled = false;
        }
    });
});
