describe('Path Visualizer', () => {
    it('should display the grid and allow node selection', async () => {
        await browser.url('http://localhost:3000');  // URL of your app, ensure the app is running

        // Wait for the page to load and the grid to be displayed
        const grid = await $('div.grid');  // Adjust selector if necessary for your grid element
        await expect(grid).toBeDisplayed();  // Ensure the grid is visible

        // Find the start node and click to select it
        const startNode = await $('div.node-start');  // Adjust selector based on your app's start node element
        await expect(startNode).toBeDisplayed();  // Ensure the start node is visible
        await startNode.click();

       
    });
});
