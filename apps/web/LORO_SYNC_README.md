# Loro Flow Sync - Multi-Window Synchronization

This implementation provides real-time synchronization of React Flow diagrams across multiple browser tabs/windows using Loro CRDT.

## Features

- **Real-time sync**: Changes made in one tab are instantly reflected in all other tabs
- **Persistent storage**: Data is saved to localStorage and restored on page reload
- **Cross-tab communication**: Uses both localStorage events and BroadcastChannel for optimal sync
- **Peer counting**: Shows how many tabs/windows are currently connected
- **Debug panel**: Real-time information about sync status and peer count

## How to Test Multi-Window Synchronization

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Open the flow sample page**:
   Navigate to `http://localhost:3001/flow-sample`

3. **Open multiple tabs/windows**:

   - Open the same URL in multiple browser tabs
   - Or open in multiple browser windows
   - You can even test across different browsers

4. **Test synchronization**:

   - **Add nodes**: Click "Add Node" in one tab, see it appear in others
   - **Move nodes**: Drag nodes around in one tab, watch them move in others
   - **Connect nodes**: Create edges between nodes, see connections sync
   - **Delete elements**: Select and delete nodes/edges, see changes propagate

5. **Monitor sync status**:
   - Check the debug panel in the bottom-right corner
   - Watch the peer count increase as you open more tabs
   - See "Last Sync" timestamp update when changes occur

## Technical Implementation

### Components

- **LoroFlowSync**: Main hook that manages Loro CRDT document and synchronization
- **DebugPanel**: Shows real-time sync information
- **Flow Sample Page**: Demo page with React Flow integration

### Synchronization Methods

1. **Loro CRDT**: Conflict-free replicated data type for consistent state management
2. **localStorage**: Persistent storage and cross-tab sync via storage events
3. **BroadcastChannel**: Real-time communication between tabs for instant updates
4. **Peer tracking**: Simple peer counting using localStorage with cleanup

### Key Features

- **Conflict resolution**: Loro CRDT automatically handles concurrent edits
- **Offline support**: Changes are saved locally and sync when tabs reconnect
- **Performance**: Efficient updates with minimal data transfer
- **Error handling**: Graceful fallbacks and error recovery

## Troubleshooting

- **Sync not working**: Check browser console for errors
- **Slow sync**: BroadcastChannel provides instant sync, localStorage events as backup
- **Data loss**: Check if localStorage is enabled and not full
- **Peer count wrong**: Peers are cleaned up after 10 seconds of inactivity

## Browser Compatibility

- Modern browsers with BroadcastChannel support
- Falls back to localStorage events for older browsers
- WebAssembly support required for Loro CRDT
