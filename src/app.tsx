import React from 'react';
import { Box } from 'ink';
import { useGameStore } from './engine/state.js';
import { TitleScreen } from './ui/screens/TitleScreen.js';
import { HubScreen } from './ui/screens/HubScreen.js';
import { MissionBriefScreen } from './ui/screens/MissionBrief.js';
import { TerminalScreen } from './ui/screens/TerminalScreen.js';
import { DebriefScreen } from './ui/screens/DebriefScreen.js';
import { ReportScreen } from './ui/screens/ReportScreen.js';

export function App() {
  const screen = useGameStore((s) => s.screen);

  return (
    <Box flexDirection="column" width="100%">
      {screen === 'title' && <TitleScreen />}
      {screen === 'hub' && <HubScreen />}
      {screen === 'mission-brief' && <MissionBriefScreen />}
      {screen === 'terminal' && <TerminalScreen />}
      {screen === 'debrief' && <DebriefScreen />}
      {screen === 'report' && <ReportScreen />}
    </Box>
  );
}
