import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useCallback, useState, useEffect } from 'react';
import Board from './src/components/Board';
import ScoreBar from './src/components/ScoreBar';
import DirectionPad from './src/components/DirectionPad';
import NicknameModal from './src/components/NicknameModal';
import Leaderboard from './src/components/Leaderboard';
import { useGameStore } from './src/store/gameStore';
import { useKeyboard } from './src/hooks/useKeyboard';
import { Direction } from './src/logic/board';
import { COLORS } from './src/constants/theme';

type Overlay = 'none' | 'nickname' | 'leaderboard';

export default function App() {
  const { board, score, bestScore, status, move, startGame, continueAfterWin, _initBest } = useGameStore();
  const [activeDir, setActiveDir]       = useState<Direction | null>(null);
  const [overlay, setOverlay]           = useState<Overlay>('none');
  const [submittedId, setSubmittedId]   = useState<string | undefined>();
  const [prevStatus, setPrevStatus]     = useState(status);

  useEffect(() => { _initBest(); }, []);

  // 게임 종료 시 자동으로 닉네임 모달 표시
  useEffect(() => {
    if (prevStatus === 'playing' && (status === 'over' || status === 'won') && score > 0) {
      setOverlay('nickname');
    }
    setPrevStatus(status);
  }, [status]);

  const handleMove = useCallback((dir: Direction) => {
    setActiveDir(dir);
    move(dir);
    setTimeout(() => setActiveDir(null), 400);
  }, [move]);

  useKeyboard(handleMove);

  const handleNewGame = () => {
    setOverlay('none');
    setSubmittedId(undefined);
    startGame();
  };

  const handleScoreSubmitted = (id?: string) => {
    setSubmittedId(id);
    setOverlay('leaderboard');
  };

  const handleSkipNickname = () => {
    setOverlay('none');
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <ScoreBar
          score={score}
          bestScore={bestScore}
          onNewGame={handleNewGame}
          onLeaderboard={() => setOverlay('leaderboard')}
        />
        <Board board={board} onSwipe={handleMove} />
        <DirectionPad activeDir={activeDir} onPress={handleMove} />
      </View>

      {/* 닉네임 입력 모달 */}
      {overlay === 'nickname' && (
        <NicknameModal
          score={score}
          onSubmitted={handleScoreSubmitted}
          onSkip={handleSkipNickname}
        />
      )}

      {/* 랭킹 화면 */}
      {overlay === 'leaderboard' && (
        <Leaderboard
          highlightId={submittedId}
          onClose={() => setOverlay('none')}
        />
      )}
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
});
