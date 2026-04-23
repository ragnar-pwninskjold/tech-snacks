# Features & States — {{project_name}}

_Scoped by the chosen UX philosophy in `01b-ux-philosophy.md`._

---

## Feature: {{feature_name}}

**User Stories:**
- As a {{persona}}, I want to {{goal}}, so that {{motivation}}.

**Screens this feature spans:**
- {{screen_name}} — {{one-sentence purpose}}

### Screen: {{screen_name}}

**States:**

#### Empty
{{what the user sees when there is no content yet; what they can do}}

#### Loading
{{what appears while data is arriving; skeleton? spinner? progressive reveal?}}

#### Populated
{{the normal, happy-path view — describe hierarchy and primary affordances}}

#### Error
{{what the user sees if something fails; how recovery works}}

#### Permission-denied
{{if relevant — what shows when auth or permission gates block access}}

#### Edge cases
- {{edge case: long content, offline, auth-gated, unusually large input, etc.}}

**Interaction notes:**
- Progressive disclosure: {{what's hidden until needed}}
- Key affordances: {{primary + secondary actions}}
- What changes between states: {{transition behavior}}

---

(Repeat the "Feature:" block per feature.)
