# DATABASE BLUEPRINT

## Objetivo

Definir todas as entidades principais do Setas Portugal antes da implementação na base de dados.

Cada entidade representa um conceito real da modalidade.

---

# Núcleo

## Person
Representa qualquer pessoa ligada à modalidade.

Estado:
🟢 Planeado

---

## Team
Representa uma equipa.

Estado:
🟢 Implementado

---

## Organization

Representa uma entidade organizadora.

Exemplos:

- Associação Regional
- Federação
- Organização Independente

Estado:
🟡 Próxima Sprint

---

## Competition

Representa uma competição.

Exemplos:

- Liga
- Campeonato
- Taça
- Open
- Masters

Estado:
🟡 Planeado

---

## Season

Representa uma época.

Em Portugal corresponde ao ano civil.

Estado:
🟡 Planeado

---

## Match

Representa um jogo.

Estado:
🟡 Planeado

---

## Venue

Representa um local.

Exemplos:

- Café
- Clube
- Pavilhão

Estado:
🟡 Planeado

---

# Histórico

## Team History

Histórico das equipas de um jogador.

Estado:
🟢 Implementado

---

## Competition History

Histórico das edições de uma competição.

Estado:
🟡 Planeado

---

# Estatísticas

## Player Statistics

Sempre calculadas.

Nunca preenchidas manualmente.

---

## Team Statistics

Sempre calculadas.

---

## Rankings

Sempre calculados.

---

# Média / Average

Sempre calculada.

Nunca armazenada.

---

# Filosofia

Os dados permanentes são armazenados.

Os dados calculados são sempre gerados a partir dos resultados existentes.

Nunca guardar informação duplicada.
