// import type { AnalyzeResponse } from "../types/index";

// const API_URL = "http://localhost:8000/api";

// export const analyzeResume = async (data: {
//   resume_text: string;
//   job_description: string;
// }): Promise<AnalyzeResponse> => {
//   const res = await fetch(`${API_URL}/analyze`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   if (!res.ok) {
//     throw new Error("API Error");
//   }

//   return res.json();
// };
