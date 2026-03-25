export const getAnimalEmoji = (name) => {
  const mapping = {
    'Avestruz': '🐦', 'Águia': '🦅', 'Burro': '🐴', 'Borboleta': '🦋', 'Cachorro': '🐶',
    'Cabra': '🐐', 'Carneiro': '🐏', 'Camelo': '🐪', 'Cobra': '🐍', 'Coelho': '🐰',
    'Cavalo': '🐎', 'Elefante': '🐘', 'Galo': '🐓', 'Gato': '🐈', 'Jacaré': '🐊',
    'Leão': '🦁', 'Macaco': '🐒', 'Porco': '🐷', 'Pavão': '🦚', 'Peru': '🦃',
    'Touro': '🐂', 'Tigre': '🐅', 'Urso': '🐻', 'Veado': '🦌', 'Vaca': '🐄'
  };
  return mapping[name] || '🎲';
};

export const getAnimalByNumber = (number, type) => {
  if (!number) return null;
  
  const animals = [
    'Avestruz', 'Águia', 'Burro', 'Borboleta', 'Cachorro',
    'Cabra', 'Carneiro', 'Camelo', 'Cobra', 'Coelho',
    'Cavalo', 'Elefante', 'Galo', 'Gato', 'Jacaré',
    'Leão', 'Macaco', 'Porco', 'Pavão', 'Peru',
    'Touro', 'Tigre', 'Urso', 'Veado', 'Vaca'
  ];

  let groupIndex = 0;

  if (type === 'grupo') {
    groupIndex = parseInt(number) - 1;
  } else {
    // Para Dezena ou Milhar, pegamos os 2 últimos dígitos
    const lastTwo = parseInt(number.toString().slice(-2));
    // Regra do Jogo do Bicho: Dezena 00 conta como 100 para o cálculo do grupo
    const checkDezena = lastTwo === 0 ? 100 : lastTwo;
    groupIndex = Math.ceil(checkDezena / 4) - 1;
  }

  return {
    name: animals[groupIndex] || 'Desconhecido',
    group: (groupIndex + 1).toString().padStart(2, '0')
  };
};