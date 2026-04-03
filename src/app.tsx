import React from 'react';
import { Box } from 'ink';
import { useGameStore } from './engine/state.js';
import { TitleScreen } from './ui/screens/TitleScreen.js';
import { OrientationScreen } from './ui/screens/OrientationScreen.js';
import { HubScreen } from './ui/screens/HubScreen.js';
import { MissionBriefScreen } from './ui/screens/MissionBrief.js';
import { TerminalScreen } from './ui/screens/TerminalScreen.js';
import { DebriefScreen } from './ui/screens/DebriefScreen.js';
import { ReportScreen } from './ui/screens/ReportScreen.js';
import { AboutScreen } from './ui/screens/AboutScreen.js';
import { GuideScreen } from './ui/screens/GuideScreen.js';

export function App() {
  const screen = useGameStore((s) => s.screen);

  return (
    <Box flexDirection="column" width="100%">
      {screen === 'title' && <TitleScreen />}
      {screen === 'tutorial' && <OrientationScreen />}
      {screen === 'hub' && <HubScreen />}
      {screen === 'mission-brief' && <MissionBriefScreen />}
      {screen === 'terminal' && <TerminalScreen />}
      {screen === 'debrief' && <DebriefScreen />}
      {screen === 'report' && <ReportScreen />}
      {screen === 'about' && <AboutScreen />}
      {screen === 'guide' && <GuideScreen />}
    </Box>
  );
}
