# Credenciais de Demonstração — AbrigoAção

**Versão:** 1.0  
**Data:** 2026-11-12  
**Referência:** Tarefa 007 — Identidade, acesso e consolidação da entrega final

---

## Regras de Acesso

- **Senha:** Não há senha no aplicativo. O login é feito apenas com o nome.
- **Perfil Voluntário:** Prefixo `v-` antes do primeiro nome (ex: `v-Matheus`)
- **Perfil Coordenação:** Apenas o primeiro nome (ex: `Matheus`)
- **Normalização:** Caixa, acentos e espaços extras são ignorados automaticamente

---

## Lista de Credenciais (16 acessos)

| Pessoa | Login Coordenação | Login Voluntário |
|--------|-------------------|------------------|
| Filipe Angi | `Filipe` | `v-Filipe` |
| João Tamosaitis | `João` | `v-João` |
| André Luis | `André` | `v-André` |
| Giovana Carvalho | `Giovana` | `v-Giovana` |
| Isabela Patino | `Isabela` | `v-Isabela` |
| Lucas Blanes | `Lucas` | `v-Lucas` |
| Matheus Peruzza | `Matheus` | `v-Matheus` |
| Betania | `Betania` | `v-Betania` |

---

## Exemplos de Entrada Válida

| Entrada do Usuário | Normalizado | Perfil | Pessoa |
|--------------------|-------------|--------|--------|
| `Matheus` | `matheus` | Coordenação | Matheus Peruzza |
| `matheus` | `matheus` | Coordenação | Matheus Peruzza |
| `MATHEUS` | `matheus` | Coordenação | Matheus Peruzza |
| `v-Matheus` | `v-matheus` | Voluntário | Matheus Peruzza |
| `V-MATHEUS` | `v-matheus` | Voluntário | Matheus Peruzza |
| ` v-matheus ` | `v-matheus` | Voluntário | Matheus Peruzza |
| `João` | `joao` | Coordenação | João Tamosaitis |
| `v-João` | `v-joao` | Voluntário | João Tamosaitis |

---

## Observações

- As credenciais são **públicas e demonstrativas**, destinadas apenas à avaliação acadêmica.
- Não representam autenticação real nem autorização segura.
- Dois acessos da mesma pessoa (Coordenação/Voluntário) compartilham a identidade nominal.
- Dados locais persistem no dispositivo (AsyncStorage) e não são compartilhados entre aparelhos.