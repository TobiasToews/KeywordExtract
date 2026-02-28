
import { PromptTemplate } from './types';

const COMMON_JSON_SYSTEM_PROMPT = "You are a precise research keyword extraction engine. You must extract concepts according to the user's goal. Return valid JSON only adhering to the schema. Quotes must be exact substrings from the text.";

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    //should be fine?  -> tested?
    id: "RQ1_LEARNING_V1",
    name: "RQ1: Learning Mechanisms",
    version: "1.0.0",
    system: COMMON_JSON_SYSTEM_PROMPT,
    user_template: `
PAPER CONTENT:
<paper_text>
{text}
</paper_text>

RESEARCH CONTEXT:
MAIN GOAL (RQ1): How are object affordances represented and acquired in LLMs, VLMs, VAMs, and related models, and how does this compare to representations of digital affordances? → (representation and learning)
SPECIFIC SUB-GOAL (RQ1.1):  What mechanisms are proposed for how LLMs/VLMs "learn" or encode affordances from training data.

EXTRACTION GOAL:
TASK: Identify candidate mechanisms from the paper.
SCOPE: Mechanisms described HOW LLMs/VLMs learn/encode/acquire (object) affordances FROM TRAINING DATA (signals, supervision, mechanisms).
EXCLUDE: represetations, inference, architecture, datasets, metrics.
PROCEDURE:
1. Scan for passages explaining learning/encoding mechanisms.
2. Select at most 5 most central mechanisms, but if there are non described in the text just return "None found".
3. Reduce to one atomic keyword/noun phrase including its exact substring from the text.
    `,
    expected_format: "JSON",
    min_items: 0,
    max_items: 5
  },
  {
    id: "RQ1_REPRESENTATION_AND_TRADEOFFS_V1",
    name: "RQ1: Representation Types and Tradeoffs",
    version: "1.0.0",
    system: COMMON_JSON_SYSTEM_PROMPT,

    // merge this question with RQ1_Tradeoff_V1 s.t. the model has the context of Representations for which it has to search for Tradeoffs
    user_template: `
PAPER CONTENT:
<paper_text>
{text}
</paper_text>

RESEARCH CONTEXT:
MAIN GOAL (RQ1): How are object affordances represented and acquired in LLMs, VLMs, VAMs, and related models, and how does this compare to representations of digital affordances? → (representation and learning)
SPECIFIC SUB-GOAL (RQ1.2): What types of affordance representations exist (embedding based, keypoint maps, interaction graphs, scene graphs, etc.), and what are their trade offs.

EXTRACTION GOAL:
TASK: Extract affordance REPRESENTATION types (voxels, point clouds, meshes, latents, embedding based, keypoint maps, interaction graphs, scene graphs and others which you identify.).
SCOPE: Only representation-level concepts and their tradeoffs.
EXCLUDE: learning mechanisms, training data, architectures, tasks.
PROCEDURE:
1. Search for descriptions of affordance representations and if any described their tradeoffs.
2. Select at most 5 most central representation types and their tradeoffs, but if there are non described in the text just return "None found".
3. Reduce the representation one atomic keyword/noun phrase including its exact substring from the text. If you found a tradeoff that matched the representation, reduce it to one atomic keyword and add the representation type for relatability of tradeoff to representation type.
4. Return both representations and tradeoffs as sepreate items. 
    `,
    expected_format: "JSON",
    min_items: 0,
    max_items: 10
  },
//maybe kick out RQ1_TRADEOFF_V1
  {
    id: "RQ1_TRADEOFF_V1",
    name: "RQ1: Representation Trade-offs",
    version: "1.0.0",
    system: COMMON_JSON_SYSTEM_PROMPT,
    user_template: `
PAPER CONTENT:
<paper_text>
{text}
</paper_text>

RESEARCH CONTEXT:
MAIN GOAL (RQ1): How are object affordances represented and acquired in LLMs, VLMs, VAMs, and related models, and how does this compare to representations of digital affordances? → (representation and learning)
SPECIFIC SUB-GOAL (RQ1.2): 

EXTRACTION GOAL:
TASK: Identify representational trade-offs, limitations, or compromises discussed.
SCOPE: Generalization vs interpretability, realism vs efficiency, complexity, etc.
EXCLUDE: descriptions of the representation itself, learning, reasoning, architecture.
PROCEDURE:
1. Scan for advantages, disadvantages, or limitations of the representations.
2. Select at most 5 most central trade-offs, but if there are non described in the text just return "None found".
3. Reduce to one atomic keyword/noun phrase including its exact substring from the text.
    `,
    expected_format: "JSON",
    min_items: 0,
    max_items: 5
  },
  //tested with 1 paper, there it seemed to work!
  {
    id: "RQ1_COMPARISON_V1",
    name: "RQ1: vs Digital Affordances",
    version: "1.0.0",
    system: COMMON_JSON_SYSTEM_PROMPT,
    user_template: `
PAPER CONTENT:
<paper_text>
{text}
</paper_text>

RESEARCH CONTEXT:
MAIN GOAL (RQ1): How are object affordances represented and acquired in LLMs, VLMs, VAMs, and related models, and how does this compare to representations of digital affordances? → (representation and learning)
SPECIFIC SUB-GOAL (RQ1.3): How do representations for physical/object affordances differ from those for digital or hypermedia affordances.

EXTRACTION GOAL:
TASK: Identify concepts comparing physical/object affordance representations to digital/interface/web affordance representations.
SCOPE: Differences, boundaries between physical/object and digital affordance representations in the context of LLMs/VLMs/VAMs and related models.
EXCLUDE: standard definitions without comparison.
PROCEDURE:
1. Search for mentioned differences between digital, UI, web, or virtual affordance representations vs physical/object affordance representations.
2. Select at most 5 most central differences, but if there are non described in the text just return "None found".
3. Reduce to one atomic keyword/noun phrase including its exact substring from the text.
    `,
    expected_format: "JSON",
    min_items: 0,
    max_items: 5
  },
  // tested with one paper seems to work
  // returned 5 keywords which seemed reasonable
  {
    id: "RQ2_REASONING_V1",
    name: "RQ2: Reasoning Role",
    version: "1.0.0",
    system: COMMON_JSON_SYSTEM_PROMPT,
    user_template: `
PAPER CONTENT:
<paper_text>
{text}
</paper_text>

RESEARCH CONTEXT:
MAIN GOAL (RQ2): How do current models reason about and use object affordances in inference time pipelines for robot manipulation or related tasks? → (reasoning and use in pipelines)
SPECIFIC SUB-GOAL (RQ2.1): In what ways do LLMs/VLMs contribute to affordance reasoning in the proposed framework/inference time pipeline.

EXTRACTION GOAL:
TASK: Identify the role of LLMs/VLMs in reasoning about affordances.
SCOPE: Interpreting relations, inferring possibilities, evaluating feasibility/constraints.
EXCLUDE: learning, planning, control, datasets, Information found in the section "Related Work".
PROCEDURE:
1. Scan for LLM/VLM involvement in reasoning about affordances.
2. Select at most 5 most central reasoning concepts, but if there are non described in the text just return "None found".
3. Reduce to one atomic keyword/noun phrase including its exact substring from the text.
    `,
    expected_format: "JSON",
    min_items: 0,
    max_items: 5
  },
  // Testing:
  // For 3D-AffordanceLLM: retuned zero keywords!
  // for A3VLM: returend 5 keywords, but seemed made up, as there is nothing about planning, except in related work
  // for "Affordance Grounding from Demonstration": returned zero keywords
  // for "Affordance-Based_Goal_Imagination_for_Embodied_AI_Agents.pdf": returned "discerning plausible from implausible actions" which makes total sense!
  // -> seems to be ok/good, but filter the results later on, as it sometimes thinks quotes are relevant keywords which the arnt

  {
    id: "RQ2_PLANNING_V1",
    name: "RQ2: Planning Role",
    version: "1.0.0",
    system: COMMON_JSON_SYSTEM_PROMPT,
    user_template: `
PAPER CONTENT:
<paper_text>
{text}
</paper_text>

RESEARCH CONTEXT:
MAIN GOAL (RQ2): How do current models reason about and use object affordances in inference time pipelines for robot manipulation or related tasks? → (reasoning and use in pipelines)
SPECIFIC SUB-GOAL (RQ2.1): In what ways do LLMs/VLMs contribute to affordance planning in the proposed framework/inference time pipeline.

EXTRACTION GOAL:
TASK: Identify the role of LLMs/VLMs in planning actions based on affordances.
SCOPE: Sequencing, task decomposition, goal formulation, plan generation.
EXCLUDE: learning, reasoning without planning, low-level control.
PROCEDURE:
1. Scan for LLM/VLM involvement in planning using affordance info.
2. Select at most 5 most central planning concepts, but if there are non described in the text just return "None found".
3. Reduce to one atomic keyword/noun phrase including its exact substring from the text.
    `,
    expected_format: "JSON",
    min_items: 0,
    max_items: 5
  },

  // TEST:
  // For 3D-AffordanceLLM: retuned nonsense 
  // for A3VLM: returend nonsense
  // for "Affordance Grounding from Demonstration": returned nothing
  // for "Affordance-Based_Goal_Imagination_for_Embodied_AI_Agents.pdf": returned keywords which looked like planning

  //maybe keep it for further extraction -> seems like "planning" and "decison making" are the same or at least very similar
  {
    id: "RQ2_DECISION_V1",
    name: "RQ2: Decision Making",
    version: "1.0.0",
    system: COMMON_JSON_SYSTEM_PROMPT,
    user_template: `
PAPER CONTENT:
<paper_text>
{text}
</paper_text>

RESEARCH CONTEXT:
MAIN GOAL (RQ2): How do current models reason about and use object affordances in inference time pipelines for robot manipulation or related tasks? → (reasoning and use in pipelines)
SPECIFIC SUB-GOAL (RQ2.1): In what ways do LLMs/VLMs contribute to affordance decision making in the proposed framework/inference time pipeline.

EXTRACTION GOAL:
TASK: Identify the role of LLMs/VLMs in making decisions based on affordances.
SCOPE: Selecting actions, filtering/ranking, resolving ambiguities.
EXCLUDE: learning, reasoning without decision outcomes, planning, control.
PROCEDURE:
1. Scan for LLM/VLM involvement in affordance-based decision making.
2. Select at most 5 most central decision making concepts, but if there are non described in the text just return "None found".
3. Reduce to one atomic keyword/noun phrase including its exact substring from the text.
    `,
    expected_format: "JSON",
    min_items: 0,
    max_items: 5
  },
  // TEST:
  // For 3D-AffordanceLLM: retuned 
  // for A3VLM: returend
  // for "Affordance Grounding from Demonstration": returned 
  // for "Affordance-Based_Goal_Imagination_for_Embodied_AI_Agents.pdf": returned 
  // conclusion: 
  {
    id: "RQ2_IMITATION_V1",
    name: "RQ2: Imitation Pipelines",
    version: "1.0.0",
    system: COMMON_JSON_SYSTEM_PROMPT,
    user_template: `
PAPER CONTENT:
<paper_text>
{text}
</paper_text>

RESEARCH CONTEXT:
MAIN GOAL (RQ2): How do current models reason about and use object affordances in inference time pipelines for robot manipulation or related tasks? → (reasoning and use in pipelines)
SPECIFIC SUB-GOAL (RQ2.2): What is the role of affordances in imitation based robot manipulation pipelines.

EXTRACTION GOAL:
TASK: Identify the role of object affordances in immitation based robot manipulation pipelines from the paper.
SCOPE Concepts describing the role that object affordances play within imitation learning or demonstration-based manipulation.
EXCLUDE: datasets, non inference time pipeline, parts not about affordances, parts not about robot manipulation based on imiation learning
PROCEDURE:
1. Scan for passages describing imitation learning involving affordances.
2. Select at most 5 most central concepts that relate to how affordances get used in imitation based robot manipulation pipelines, but if there are non described in the text just return "None found".
3. Reduce to one atomic keyword/noun phrase including its exact substring from the text.
    `,
    expected_format: "JSON",
    min_items: 0,
    max_items: 5
  },
  // TEST:
  // For 3D-AffordanceLLM: retuned 
  // for A3VLM: returend VLM, LLaMa3 ...
  // for "Affordance Grounding from Demonstration": returned 
  // for "Affordance-Based_Goal_Imagination_for_Embodied_AI_Agents.pdf": returned 
  // conclusion: -> seems to work
  

  // -> I think you will need to extract keywords here and classify them yourself later
  // -> will for sure have a bias towards LLMs/VLMs as you filtered for them in the paper filtering
  // refine EXCLUDE
  {
    id: "RQ3_ARCHITECTURE_V1",
    name: "RQ3: Grounding Architecture",
    version: "1.0.0",
    system: COMMON_JSON_SYSTEM_PROMPT,
    user_template: `
PAPER CONTENT:
<paper_text>
{text}
</paper_text>

RESEARCH CONTEXT:
MAIN GOAL (RQ3): What architectures, datasets, and prompting strategies are used for affordance learning and grounding, and how well do they perform? → (architectures, datasets, prompting, …)
SPECIFIC SUB-GOAL (RQ3.1): What are the main architecture families for affordance grounding, particularly those that include LLMs or VLMs in the loop.

EXTRACTION GOAL:
TASK: Identify Architectures that include LLMs and VLMs.
SCOPE: Architectural concepts and components, which include LLMs or VLMs,that enable object affordance grounding. Only Architecture and Frameworks proposed by this paper and not contained in the "related work" section.
EXCLUDE: Datasets, Prompting Techniques, Affordance Planning, Affordance Decision Making, Other Affordance Task except from Affordance Grounding
PROCEDURE:
1. Scan for passages describing system or model architectures related to affordance grounding.
2. Select at most 5 most central architectural concepts, but if there are non described in the text just return "None found".
3. Reduce to one atomic keyword/noun phrase including its exact substring from the text.
    `,
    expected_format: "JSON",
    min_items: 0,
    max_items: 5
  },
  // TEST:
  // For 3D-AffordanceLLM: retuned datasets -> all goods
  // for A3VLM: returend datasets -> all good
  // for "Affordance Grounding from Demonstration": returned datasets form related work -> was kind of messy
  // for "Affordance-Based_Goal_Imagination_for_Embodied_AI_Agents.pdf": returned 
  // conclusion: -> seemed to kind of work, but related work section was kind of messy I guess? -> maybe remove related work, if its too messy for all the papers

  // TBC: maybe exclude related work
  {
    id: "RQ3_DATASETS_V1",
    name: "RQ3: Affordance Datasets",
    version: "1.0.0",
    system: COMMON_JSON_SYSTEM_PROMPT,
    user_template: `
PAPER CONTENT:
<paper_text>
{text}
</paper_text>

RESEARCH CONTEXT:
MAIN GOAL (RQ3): What architectures, datasets, and prompting strategies are used for affordance learning and grounding, and how well do they perform? → (architectures, datasets, prompting, …)
SPECIFIC SUB-GOAL (RQ3.2): What datasets exist for object affordance learning and grounding, how are they constructed, and what limitations do they have. (used for LLMs/VLMs)

EXTRACTION GOAL:
TASK: Identify the mentioned datasets for object affordance learning and grounding used in this paper and in the "related work" section.
SCOPE: Concepts referring to datasets used for object affordance learning or affordance grounding.
EXCLUDE: Construction of Datasets, Limitations of Datasets, Architectures, Prompting Techniques, non Dataset related Topics
PROCEDURE:
1. Scan for passages mentioning datasets used for affordance learning/grounding.
2. Select at most 5 most central datasets, but if there are non described in the text just return "None found".
3. Reduce to one atomic keyword/noun phrase including its exact substring from the text.
    `,
    expected_format: "JSON",
    min_items: 0,
    max_items: 5
  },
  // TEST:
  // For 3D-AffordanceLLM: retuned 
  // for A3VLM: returend
  // for "Affordance Grounding from Demonstration": returned 
  // for "Affordance-Based_Goal_Imagination_for_Embodied_AI_Agents.pdf": returned 
  // conclusion: -> seemed to work, but keywords/how the dataset was constucted is mentioned via muliple quotes -> hence you probably need to look into the paper later on 
  // OR make up another extraction scheme, like first search for all sections that explain how they constructed their dataset, summerize them and then give these out as keywords (without specific reference? )

  {
    id: "RQ3_CONSTRUCTION_V1",
    name: "RQ3: Dataset Construction",
    version: "1.0.0",
    system: COMMON_JSON_SYSTEM_PROMPT,
    user_template: `
PAPER CONTENT:
<paper_text>
{text}
</paper_text>

RESEARCH CONTEXT:
MAIN GOAL (RQ3): What architectures, datasets, and prompting strategies are used for affordance learning and grounding, and how well do they perform? → (architectures, datasets, prompting, …)
SPECIFIC SUB-GOAL (RQ3.2): What datasets exist for object affordance learning and grounding, how are they constructed, and what limitations do they have. (used for LLMs/VLMs)

EXTRACTION GOAL:
TASK: Identify candidate concepts that describe how the authors created their dataset, if they created their own datasets, else return "None found".
SCOPE: Concepts describing how affordance datasets are constructed (annotation, collection, synthetic, etc.).
EXCLUDE: Limitations of Datasets, Architectures, Prompting Techniques, non Dataset related Topics
PROCEDURE:
1. Scan for passages describing how affordance datasets are constructed and created.
2. Select at most 5 most central dataset-construction-related concepts, but if there are non described in the text just return "None found".
3. Reduce to one atomic keyword/noun phrase including its exact substring from the text.
    `,
    expected_format: "JSON",
    min_items: 0,
    max_items: 5
  },
  // TEST:
  // For 3D-AffordanceLLM: retuned 
  // for A3VLM: returend
  // for "Affordance Grounding from Demonstration": returned 
  // for "Affordance-Based_Goal_Imagination_for_Embodied_AI_Agents.pdf": returned 
  // conclusion: -> seems good

  // Test here if the Name of limitation and Name of Dataset works 
  //-> Tries to include the name of the dataset into the keyword, but doesnt do it all the time Doesnt extract the name of the dataset 
  {
    id: "RQ3_LIMITATIONS_V1",
    name: "RQ3: Dataset Limitations",
    version: "1.0.0",
    system: COMMON_JSON_SYSTEM_PROMPT,
    user_template: `
PAPER CONTENT:
<paper_text>
{text}
</paper_text>

RESEARCH CONTEXT:
MAIN GOAL (RQ3): What architectures, datasets, and prompting strategies are used for affordance learning and grounding, and how well do they perform? → (architectures, datasets, prompting, …)
SPECIFIC SUB-GOAL (RQ3.2): What datasets exist for object affordance learning and grounding, how are they constructed, and what limitations do they have. (used for LLMs/VLMs)

EXTRACTION GOAL:
TASK: Identify the limitations of the datasets used for object affordance learning and grounding in this paper. Return the name of the Limitations together with the dataset to which this limitation is related.
SCOPE: Concepts describing limitations, weaknesses, or constraints of datasets (bias, scale, diversity, etc.).
EXCLUDE: Construction of Datasets, Architectures, Prompting Techniques, non Dataset related Topics
PROCEDURE:
1. Scan for passages discussing limitations of datasets used in the study.
2. Select at most 5 most central limitation-related concepts, but if there are non described in the text just return "None found".
3. Reduce to into keywords that contain the limitation and its related dataset,and its exact substring from the text.
    `,
    expected_format: "JSON",
    min_items: 0,
    max_items: 5
  },
  // TEST:
  // For 3D-AffordanceLLM: returned the query instruction 
  // for A3VLM: returend bullshit
  // for "Affordance Grounding from Demonstration": returned nothing
  // for "Affordance-Based_Goal_Imagination_for_Embodied_AI_Agents.pdf": returned somewhats okish result -> gave one promt
  // conclusion: not so sure how reliable it is

  // -> maybe continoue searching? 
  {
    id: "RQ3_STRATEGIES_V1",
    name: "RQ3: Prompting Strategies",
    version: "1.0.0",
    system: COMMON_JSON_SYSTEM_PROMPT,
    user_template: `
PAPER CONTENT:
<paper_text>
{text}
</paper_text>

RESEARCH CONTEXT:
MAIN GOAL (RQ3): What architectures, datasets, and prompting strategies are used for affordance learning and grounding, and how well do they perform? → (architectures, datasets, prompting, …)
SPECIFIC SUB-GOAL (RQ3.3): Which prompting styles are used to query affordances from LLMs/VLMs?

EXTRACTION GOAL:
TASK: Identify the promping techniques to query affordance used in this paper, without the "Related Work" Section.
SCOPE: Concepts describing prompting strategies used to query or elicit affordance information from LLMs/VLMs.
EXCLUDE: Datasets, Architectures, non Prompting related Topics
PROCEDURE:
1. Scan for passages describing prompting techniques used with LLMs/VLMs, which searches for affordances.
2. Select at most 5 prompting techniques used to query affordances form LLMs/VLMs, but if there are non described in the text just return "None found".
3. Reduce each prompting technique to a keyword/noun phrase including its exact substring from the text.
    `,
    expected_format: "JSON",
    min_items: 0,
    max_items: 5
  },
  // TEST:
  // For 3D-AffordanceLLM: retuned 
  // for A3VLM: returend
  // for "Affordance Grounding from Demonstration": returned 
  // for "Affordance-Based_Goal_Imagination_for_Embodied_AI_Agents.pdf": returned 
  // conclusion: -> not really reliable!
  
  {
    id: "RQ3_PERFORMANCE_V1",
    name: "RQ3: Prompting Performance",
    version: "1.0.0",
    system: COMMON_JSON_SYSTEM_PROMPT,
    user_template: `
PAPER CONTENT:
<paper_text>
{text}
</paper_text>

RESEARCH CONTEXT:
MAIN GOAL (RQ3): What architectures, datasets, and prompting strategies are used for affordance learning and grounding, and how well do they perform? → (architectures, datasets, prompting, …)
SPECIFIC SUB-GOAL (RQ3.4): What evidence is there for effectiveness of the used prompting techniques in the paper?

EXTRACTION GOAL:
TASK: Identify the evaluation of the used promping techniques to query affordance form this paper, without the ones descibed in the "Related Work" Section.
SCOPE: Concepts providing evidence about the effectiveness or performance of prompting strategies.
EXCLUDE: Datasets, Architectures, non Prompting related Topics
PROCEDURE:
1. Scan for passages discussing performance or effectiveness of prompting techniques.
2. Select at most 5 sections discussing performance or effectivness of prompting techniques and their related prompting techniques, but if there are non described in the text just return "None found".
3. Reduce the performance of the prompting technique and its related prompting technique to a noun phrase including its exact substring from the text.
    `,
    expected_format: "JSON",
    min_items: 0,
    max_items: 5
  },
  // TEST:
  // For 3D-AffordanceLLM: retuned 
  // for A3VLM: returend
  // for "Affordance Grounding from Demonstration": returned 
  // for "Affordance-Based_Goal_Imagination_for_Embodied_AI_Agents.pdf": returned 
  // conclusion:   

  // maybe revisit PROCEDURE further?
  {
    id: "RQ4_ERRORS_V1",
    name: "RQ4: Affordance Errors",
    version: "1.0.0",
    system: COMMON_JSON_SYSTEM_PROMPT,
    user_template: `
PAPER CONTENT:
<paper_text>
{text}
</paper_text>

RESEARCH CONTEXT:
MAIN GOAL (RQ4): What are the typical failure modes and safety risks when using LLMs/VLMs for affordance discovery, and which mitigation strategies have been proposed? → (safety and traps)
SPECIFIC SUB-GOAL (RQ4.1): Which types of hallucinations and mispredictions of affordances are reported.

EXTRACTION GOAL:
TASK: Identify errors/mispredictions/hallucinations regarding LLMs/VLMs from the paper, without the ones descibed in the "Related Work" Section.
SCOPE: Concepts describing types of hallucinations, mispredictions, or erroneous affordance inferences.
EXCLUDE: Non LLM/VLM related topics, Non Affordance related topics, mitigation strategies
PROCEDURE:
1. Scan for passages reporting hallucinations or mispredictions that come from LLMs/VLMs that query affordances.
2. Select at most 5 error (missprediction, hallucination) types, but if there are non described in the text just return "None found".
3. Reduce to one atomic keyword/noun phrase, that descibes the error, including its exact substring from the text.
    `,
    expected_format: "JSON",
    min_items: 0,
    max_items: 5
  },
  // TEST:
  // For 3D-AffordanceLLM: retuned nothing
  // for A3VLM: returend nonsense
  // for "Affordance Grounding from Demonstration": returned nothing
  // for "Affordance-Based_Goal_Imagination_for_Embodied_AI_Agents.pdf": returned seemed to kind of work
  // conclusion:  -> seemed to work, but also sometimes halluzinate -> hence you need to strongly filter!
  {
    id: "RQ4_DETECTION_V1",
    name: "RQ4: Error Detection",
    version: "1.0.0",
    system: COMMON_JSON_SYSTEM_PROMPT,
    user_template: `
PAPER CONTENT:
<paper_text>
{text}
</paper_text>

RESEARCH CONTEXT:
MAIN GOAL (RQ4): What are the typical failure modes and safety risks when using LLMs/VLMs for affordance discovery, and which mitigation strategies have been proposed? → (safety and traps)
SPECIFIC SUB-GOAL (RQ4.2): How can unsafe or harmful affordances be detected or filtered in robotics and web contexts.

EXTRACTION GOAL:
TASK: Identify concepts, in the paper, about how to detect or filter not-trustworthy/unsafe/harmful affordances.
SCOPE: Concepts describing methods or mechanisms used to detect, filter, or block unsafe affordances.
EXCLUDE: Non Affordance related topics, Non Safty related topics
PROCEDURE:
1. Scan for passages describing detection or filtering of unsafe/harmful affordances. 
2. Select at most 5 most central detection/filtering of unsafe/harmful affordances concepts, but if there are non described in the text just return "None found".
3. Reduce to one atomic keyword/noun phrase, that descibes the detection/filtering method, including its exact substring from the text.
    `,
    expected_format: "JSON",
    min_items: 0,
    max_items: 5
  },

  // TEST:
  // For 3D-AffordanceLLM: retuned 
  // for A3VLM: returend
  // for "Affordance Grounding from Demonstration": returned 
  // for "Affordance-Based_Goal_Imagination_for_Embodied_AI_Agents.pdf": returned 
  // conclusion:  -> results seemed pretty similar for all of the 

  // not sure if the intetion of the question is "harmful use of affordances" or "harmful affordances" -> YOU ADJUSTED QUESTION TO "harmful affordances"
  {
    id: "RQ4_SAFETY_V1",
    name: "RQ4: Safety Measures",
    version: "1.0.0",
    system: COMMON_JSON_SYSTEM_PROMPT,
    user_template: `
PAPER CONTENT:
<paper_text>
{text}
</paper_text>

RESEARCH CONTEXT:
MAIN GOAL (RQ4): What are the typical failure modes and safety risks when using LLMs/VLMs for affordance discovery, and which mitigation strategies have been proposed? → (safety and traps)
SPECIFIC SUB-GOAL (RQ4.3): Which safety measures and design patterns have been proposed to prevent harmful affordances.

EXTRACTION GOAL:
TASK: Identify safty measures and design patterns for prevention of harmful affordances from the paper.
SCOPE: Concepts describing safety measures, safeguards, or design patterns intended to prevent harmful affordances.
PROCEDURE:
1. Scan for passages describing safety measures or design patterns for prevention of harmful affordances.
2. Select at most 5 most central concepts about safty measures or design patterns for prevention of harmful affordances, but if there are non described in the text just return "None found".
3. Reduce to one atomic keyword/noun phrase, that descibes the safty measure or design pattern, including its exact substring from the text.
    `,
    expected_format: "JSON",
    min_items: 0,
    max_items: 5
  }
];
