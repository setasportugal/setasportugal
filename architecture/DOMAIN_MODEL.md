# DOMAIN MODEL

## Objetivo

O Setas Portugal representa a história das setas em Portugal através de entidades relacionadas entre si.

O sistema deve refletir a realidade da modalidade e nunca obrigar a adaptar a realidade ao software.

---

# Entidades Principais

## Pessoa

Qualquer pessoa relacionada com a modalidade.

Exemplos:
- Jogador
- Árbitro
- Dirigente
- Organizador

---

## Equipa

Grupo de jogadores que participa em competições.

Uma equipa:
- pertence a uma organização;
- participa em competições;
- tem um histórico de jogadores;
- pode alterar nome, mantendo a sua identidade.

---

## Organização

Entidade que organiza ou representa a modalidade.

Exemplos:
- Associação Regional
- Federação
- Organização Independente

Uma organização:
- organiza competições;
- possui equipas;
- possui histórico.

---

## Competição

Prova oficial ou independente.

Exemplos:
- Liga
- Campeonato
- Taça
- Open
- Masters

Cada competição:
- pertence a uma época;
- é organizada por uma organização;
- possui histórico.

---

## Época

Ano oficial da modalidade.

Em Portugal corresponde ao ano civil.

Exemplos:

2025

2026

2027

---

## Jogo

Encontro entre jogadores ou equipas.

Um jogo pertence sempre a uma competição.

---

## Local

Espaço onde decorrem jogos ou competições.

Exemplos:
- Café
- Clube
- Pavilhão

---

# Relações

Organização
↓
Equipa

Organização
↓
Competição

Competição
↓
Época

Competição
↓
Jogos

Equipa
↓
Jogadores

Jogador
↓
Histórico de Equipas

Jogo
↓
Estatísticas

---

# Princípios

- Nada é apagado.
- Tudo possui histórico.
- Toda a informação é relacionada.
- Não existe duplicação de dados.
- A arquitetura representa a realidade da modalidade.
