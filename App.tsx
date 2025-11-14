import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

// 📚 CONCEITO TS: Exportação padrão da função App
export function App() {
  // 📚 CONCEITO TS: require.context é fornecido pelo Metro bundler
  // para carregar todos os arquivos do diretório app
  const ctx = require.context('./app');

  // 📚 CONCEITO TS: ExpoRoot é o componente raiz do Expo Router
  // que gerencia automaticamente a navegação baseada em arquivos
  return <ExpoRoot context={ctx} />;
}

// 📚 CONCEITO TS: registerRootComponent registra o componente App
// como o ponto de entrada da aplicação Expo
registerRootComponent(App);