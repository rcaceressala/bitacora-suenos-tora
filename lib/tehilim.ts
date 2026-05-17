interface VersoTehilim {
  salmo: number
  texto: string
}

const VERSOS: VersoTehilim[] = [
  { salmo: 1, texto: 'Será como árbol plantado junto a corrientes de aguas, que da su fruto en su tiempo, y su hoja no caerá.' },
  { salmo: 4, texto: 'Me has dado más alegría en mi corazón que cuando abundan el grano y el mosto.' },
  { salmo: 8, texto: '¡Cuán glorioso es tu nombre en toda la tierra, oh Señor de nuestro mundo!' },
  { salmo: 16, texto: 'A Adonai he puesto siempre delante de mí; porque está a mi diestra, no seré conmovido.' },
  { salmo: 17, texto: 'En cuanto a mí, veré tu rostro en justicia; quedaré satisfecho cuando despierte a tu semejanza.' },
  { salmo: 19, texto: 'Sean gratos los dichos de mi boca y la meditación de mi corazón delante de ti, oh Señor, roca mía y redentor mío.' },
  { salmo: 22, texto: 'Porque no menospreció ni abominó la aflicción del afligido; ni le ocultó su rostro, sino que cuando clamó, le escuchó.' },
  { salmo: 23, texto: 'Adonai es mi pastor; nada me faltará. En lugares de delicados pastos me hará descansar.' },
  { salmo: 24, texto: 'De Adonai es la tierra y su plenitud, el mundo y los que en él habitan.' },
  { salmo: 27, texto: 'Adonai es mi luz y mi salvación; ¿a quién temeré? Adonai es la fortaleza de mi vida; ¿de quién me atemorizaré?' },
  { salmo: 30, texto: 'Por la noche durará el lloro, y a la mañana vendrá la alegría.' },
  { salmo: 31, texto: 'En tu mano encomiendo mi espíritu; tú me has redimido, oh Adonai, Dios de verdad.' },
  { salmo: 34, texto: 'Gustad y ved que es bueno Adonai; dichoso el hombre que confía en él.' },
  { salmo: 37, texto: 'Deléitate en Adonai, y él te concederá las peticiones de tu corazón.' },
  { salmo: 42, texto: 'Como el ciervo brama por las corrientes de las aguas, así clama por ti, oh Dios, el alma mía.' },
  { salmo: 46, texto: 'Estad quietos, y conoced que yo soy Dios; seré exaltado entre las naciones, seré exaltado en la tierra.' },
  { salmo: 51, texto: 'Crea en mí un corazón limpio, oh Dios, y renueva un espíritu recto dentro de mí.' },
  { salmo: 55, texto: 'Echa sobre Adonai tu carga, y él te sustentará; no dejará para siempre caído al justo.' },
  { salmo: 62, texto: 'En Dios solamente está acallada mi alma; de él viene mi salvación. Él solamente es mi roca y mi salvación.' },
  { salmo: 63, texto: 'Porque mejor es tu misericordia que la vida; mis labios te alabarán. Así te bendeciré en mi vida.' },
  { salmo: 84, texto: 'Mejor es un día en tus atrios que mil fuera de ellos. Escogería antes estar a la puerta de la casa de mi Dios.' },
  { salmo: 91, texto: 'El que habita al abrigo del Altísimo morará bajo la sombra del Todopoderoso.' },
  { salmo: 100, texto: 'Porque Adonai es bueno; su misericordia es para siempre, y su fidelidad por todas las generaciones.' },
  { salmo: 103, texto: 'Como el padre se compadece de los hijos, se compadece Adonai de los que le temen.' },
  { salmo: 112, texto: 'No tendrá temor de malas noticias; su corazón está firme, confiado en Adonai.' },
  { salmo: 118, texto: 'Este es el día que hizo Adonai; nos gozaremos y alegraremos en él.' },
  { salmo: 121, texto: 'Alzaré mis ojos a los montes; ¿de dónde vendrá mi socorro? Mi socorro viene de Adonai, que hizo los cielos y la tierra.' },
  { salmo: 130, texto: 'Desde lo profundo, oh Adonai, a ti clamo. Señor, escucha mi voz; estén atentos tus oídos a la voz de mi súplica.' },
  { salmo: 139, texto: 'Te alabaré, porque formidables, maravillosas son tus obras; estoy maravillado, y mi alma lo sabe muy bien.' },
  { salmo: 145, texto: 'Cercano está Adonai a todos los que le invocan, a todos los que le invocan en verdad.' },
]

export function getVersoDelDia(): VersoTehilim {
  const diaDelMes = new Date().getDate()
  return VERSOS[(diaDelMes - 1) % VERSOS.length]
}
