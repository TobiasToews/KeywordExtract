
import { PromptTemplate } from './types';

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    id: "AFFORDANCE_EXTRACTION_V1",
    name: "General Affordance Extraction",
    version: "1.0.0",
    system: "You are a specialized AI assistant for systematic literature reviews. You extract specific concepts and their supporting evidence from research papers.",
    user_template: `
Search the full paper text provided below for mentions of 'affordances' or 'actionable properties'.
Extract at most 5 key affordance types or specific actionable features discussed.
For each item, you MUST follow this exact format:
Keyword | "quoted source phrase from text (maximum 12 words)"

Constraints:
1. Exactly one pipe (|) per line.
2. The quote MUST be wrapped in double quotes.
3. The quote MUST be verbatim from the text.
4. Provide AT MOST 5 lines.

TEXT:
{text}
    `,
    expected_format: "keyword | quote",
    min_items: 1,
    max_items: 5
  },
  {
    id: "RQ1_LEARNING_V1",
    name: "RQ1: Learning Mechanisms",
    version: "1.0.0",
    system: "Focus on how LLMs/VLMs learn or encode affordances from training data.",
    user_template: `
TASK: Identify candidate concepts from the paper.
SCOPE: Concepts describing HOW LLMs/VLMs learn/acquire affordances FROM TRAINING DATA (signals, supervision, mechanisms).
EXCLUDE: representations, inference, architecture, datasets, metrics.
PROCEDURE:
1. Scan for passages explaining learning/encoding mechanisms.
2. Extract candidate terms.
3. Select at most 5 most central mechanisms.
4. Reduce to one atomic keyword/noun phrase.

OUTPUT CONSTRAINTS:
- AT MOST 5 items.
- Format: keyword | "quoted source phrase"

TEXT:
{text}
    `,
    expected_format: "keyword | quote",
    min_items: 1,
    max_items: 5
  },
  {
    id: "RQ1_REPRESENTATION_V1",
    name: "RQ1: Representation Types",
    version: "1.0.0",
    system: "Focus on technical affordance representation models used in the paper.",
    user_template: `
TASK: Extract affordance REPRESENTATION types (voxels, point clouds, meshes, latents, etc.).
SCOPE: Only representation-level concepts.
EXCLUDE: learning mechanisms, training data, architectures, tasks.
PROCEDURE:
1. Search for descriptions of affordance representations.
2. Select at most 5 most central representation types.
3. Reduce to one atomic keyword/noun phrase.

OUTPUT CONSTRAINTS:
- AT MOST 5 items.
- Format: keyword | "quoted source phrase (≤12 words)"

TEXT:
{text}
    `,
    expected_format: "keyword | quote",
    min_items: 1,
    max_items: 5
  },
  {
    id: "RQ1_TRADEOFF_V1",
    name: "RQ1: Representation Trade-offs",
    version: "1.0.0",
    system: "Focus on limitations, compromises, and benefits vs costs of representations.",
    user_template: `
TASK: Identify representational trade-offs, limitations, or compromises discussed.
SCOPE: Generalization vs interpretability, realism vs efficiency, complexity, etc.
EXCLUDE: descriptions of the representation itself, learning, reasoning, architecture.
PROCEDURE:
1. Scan for advantages, disadvantages, or limitations of the representations.
2. Select at most 5 most central trade-offs.
3. Reduce to one atomic keyword/noun phrase.

OUTPUT CONSTRAINTS:
- AT MOST 5 items.
- Format: keyword | "quoted source phrase"

TEXT:
{text}
    `,
    expected_format: "keyword | quote",
    min_items: 1,
    max_items: 5
  },
  {
    id: "RQ1_DEFINITION_V1",
    name: "RQ1: Definition & Role",
    version: "1.0.0",
    system: "Focus on how the paper defines or characterizes object affordance.",
    user_template: `
TASK: Identify concepts that define or characterize "object affordance" or its role.
SCOPE: Explicit definitions or implicit operational meanings.
EXCLUDE: learning, representations, reasoning, architecture, datasets.
PROCEDURE:
1. Scan for explicit/implicit definitions or roles of affordances.
2. Select at most 5 most central definitional concepts.
3. Reduce to one atomic keyword/noun phrase.

OUTPUT CONSTRAINTS:
- AT MOST 5 items.
- Format: keyword | "quoted source phrase"

TEXT:
{text}
    `,
    expected_format: "keyword | quote",
    min_items: 1,
    max_items: 5
  },
  {
    id: "RQ1_COMPARISON_V1",
    name: "RQ1: vs Digital Affordances",
    version: "1.0.0",
    system: "Focus on comparisons between physical and digital/UI affordances.",
    user_template: `
TASK: Identify concepts comparing physical affordances to digital/interface/web affordances.
SCOPE: Similarities, differences, boundaries between physical and digital interpretations.
EXCLUDE: standard definitions without comparison.
PROCEDURE:
1. Scan for mentions of digital, UI, web, or virtual affordances vs physical ones.
2. Select at most 5 most central comparative concepts.
3. Reduce to one atomic keyword/noun phrase.

OUTPUT CONSTRAINTS:
- AT MOST 5 items.
- Format: keyword | "quoted source phrase"

TEXT:
{text}
    `,
    expected_format: "keyword | quote",
    min_items: 1,
    max_items: 5
  },
  {
    id: "RQ2_REALTIME_V1",
    name: "RQ2: Real-time Execution",
    version: "1.0.0",
    system: "Determine if the method runs at inference/real-time.",
    user_template: `
TASK: Identify evidence that the method is executed at inference/real-time.
SCOPE: Online querying, runtime planning/control, closed-loop interaction.
EXCLUDE: pretraining, offline analysis, simulation-only without runtime claims.
PROCEDURE:
1. Scan for runtime, inference-time, or real-time execution mentions.
2. If YES, extract at most 5 terms explaining how.

OUTPUT CONSTRAINTS:
- Start with YES or NO.
- If YES: follow with AT MOST 5 items.
- Format: keyword | "quoted source phrase"

TEXT:
{text}
    `,
    expected_format: "keyword | quote",
    min_items: 1,
    max_items: 5
  },
  {
    id: "RQ2_REASONING_V1",
    name: "RQ2: Reasoning Role",
    version: "1.0.0",
    system: "Focus on how LLMs/VLMs reason about object-action relations.",
    user_template: `
TASK: Identify the role of LLMs/VLMs in reasoning about affordances.
SCOPE: Interpreting relations, inferring possibilities, evaluating feasibility/constraints.
EXCLUDE: learning, planning, control, architecture, datasets.
PROCEDURE:
1. Scan for LLM/VLM involvement in reasoning about affordances.
2. Select at most 5 most central reasoning concepts.
3. Reduce to one atomic keyword/noun phrase.

OUTPUT CONSTRAINTS:
- AT MOST 5 items.
- Format: keyword | "quoted source phrase"

TEXT:
{text}
    `,
    expected_format: "keyword | quote",
    min_items: 1,
    max_items: 5
  },
  {
    id: "RQ2_PLANNING_V1",
    name: "RQ2: Planning Role",
    version: "1.0.0",
    system: "Focus on action sequencing and plan generation conditioned on affordances.",
    user_template: `
TASK: Identify the role of LLMs/VLMs in planning actions based on affordances.
SCOPE: Sequencing, task decomposition, goal formulation, plan generation.
EXCLUDE: learning, reasoning without planning, low-level control, architecture.
PROCEDURE:
1. Scan for LLM/VLM involvement in planning using affordance info.
2. Select at most 5 most central planning concepts.
3. Reduce to one atomic keyword/noun phrase.

OUTPUT CONSTRAINTS:
- AT MOST 5 items.
- Format: keyword | "quoted source phrase"

TEXT:
{text}
    `,
    expected_format: "keyword | quote",
    min_items: 1,
    max_items: 5
  },
  {
    id: "RQ2_DECISION_V1",
    name: "RQ2: Decision Making",
    version: "1.0.0",
    system: "Focus on selecting actions and resolving ambiguities using affordances.",
    user_template: `
TASK: Identify the role of LLMs/VLMs in making decisions based on affordances.
SCOPE: Selecting actions, filtering/ranking, resolving ambiguities.
EXCLUDE: learning, reasoning without decision outcomes, planning, control.
PROCEDURE:
1. Scan for LLM/VLM involvement in affordance-based decision making.
2. Select at most 5 most central decision concepts.
3. Reduce to one atomic keyword/noun phrase.

OUTPUT CONSTRAINTS:
- AT MOST 5 items.
- Format: keyword | "quoted source phrase"

TEXT:
{text}
    `,
    expected_format: "keyword | quote",
    min_items: 1,
    max_items: 5
  }
];
