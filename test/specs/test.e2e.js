describe('Path Visualizer', () => {
    it('should display the grid and allow node selection', async () => {
        await browser.url('http://localhost:3000');  // URL of your app, ensure the app is running

        // Wait for the page to load and the grid to be displayed
        const grid = await $('div.grid');  // Adjust selector if necessary for your grid element
        await expect(grid).toBeDisplayed();  // Ensure the grid is visible

    
       
    });
});
