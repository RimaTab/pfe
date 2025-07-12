1:import { useState, useEffect } from 'react';
2:import Head from 'next/head';
3:import { Check, X } from 'lucide-react';
4:import { useRouter } from 'next/router';
5:
6:export default function Quiz() {
7:  const router = useRouter();
8:  const [currentQuestion, setCurrentQuestion] = useState(0);
9:  const [selectedOption, setSelectedOption] = useState(null);
10:  const [answers, setAnswers] = useState({});
11:  const [showResult, setShowResult] = useState(false);
12:  const [isSubmitting, setIsSubmitting] = useState(false);
13:  const [error, setError] = useState('');
14:
15:  // Initialize selected option from answers if it exists
16:  useEffect(() => {
17:    if (answers[currentQuestion] !== undefined) {
18:      setSelectedOption(answers[currentQuestion]);
19:    } else {
20:      setSelectedOption(questions[currentQuestion].type === 'number' ? '' : null);
21:    }
22:  }, [currentQuestion, answers]);
23:
24:  const questions = [
25:    {
26:      id: 'objective',
27:      type: 'objective',
28:      question: "Quel est votre objectif principal ?",
29:      options: [
30:        "Perdre du poids",
31:        "Prendre du muscle",
32:        "??tre en meilleure sant??",
33:        "Am??liorer mes performances sportives"
34:      ],
35:      description: "Choisissez l'objectif qui vous correspond le mieux"
36:    },
37:    {
38:      id: 'age',
39:      type: 'number',
40:      inputType: 'number',
41:      question: "Quel est votre ??ge ?",
42:      placeholder: "30",
43:      min: 1,
44:      max: 120
45:    },
46:    {
47:      id: 'height',
48:      type: 'number',
49:      inputType: 'number',
50:      question: "Quelle est votre taille ?",
51:      placeholder: "175",
52:      min: 100,
53:      max: 250,
54:      unit: 'cm'
55:    },
56:    {
57:      id: 'weight',
58:      type: 'number',
59:      inputType: 'number',
60:      question: "Quel est votre poids actuel ?",
61:      placeholder: "70",
62:      min: 30,
63:      max: 300,
64:      unit: 'kg'
65:    },
66:    {
67:      id: 'activity',
68:      type: 'activity',
69:      question: "Quel est votre niveau d'activit?? physique ?",
70:      options: [
71:        "S??dentaire (peu ou pas d'exercice)",
72:        "L??g??rement actif (1-3 jours/semaine)",
73:        "Mod??r??ment actif (3-5 jours/semaine)",
74:        "Tr??s actif (6-7 jours/semaine)",
75:        "Extr??mement actif (sportif professionnel ou travail physique)"
76:      ],
77:      description: "S??lectionnez le niveau qui correspond le mieux ?? votre routine"
78:    }
79:  ];
80:
81:  const handleOptionSelect = (optionIndex) => {
82:    setSelectedOption(optionIndex);
83:  };
84:
85:  const handlePrev = () => {
86:    if (currentQuestion > 0) {
87:      setCurrentQuestion(currentQuestion - 1);
88:      // Pre-fill the previous question's answer if it exists
89:      setSelectedOption(answers[currentQuestion - 1] !== undefined ? answers[currentQuestion - 1] : null);
90:    }
91:  };
92:
93:  const handleNext = () => {
94:    // Save the current answer
95:    setAnswers({
96:      ...answers,
97:      [currentQuestion]: selectedOption
98:    });
99:
100:    // Move to next question or show results
101:    if (currentQuestion < questions.length - 1) {
102:      setCurrentQuestion(currentQuestion + 1);
103:      // Pre-fill the next question's answer if it exists
104:      setSelectedOption(answers[currentQuestion + 1] !== undefined ? answers[currentQuestion + 1] : null);
105:    } else {
106:      // Submit the form or show results
107:      console.log('Form submitted:', { ...answers, [currentQuestion]: selectedOption });
108:      setShowResult(true);
109:    }
110:  };
111:
112:  const restartQuiz = () => {
113:    setCurrentQuestion(0);
114:    setSelectedOption(null);
115:    setAnswers({});
116:    setShowResult(false);
117:    setError('');
118:  };
119:
120:  if (showResult) {
121:    return (
122:      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
123:        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
124:          <h1 className="text-3xl font-bold text-gray-900 mb-6">R??sultats du Quiz</h1>
125:          <div className="text-5xl font-bold text-green-600 mb-6">
126:            {score} / {questions.length}
127:          </div>
128:          <p className="text-gray-600 mb-8">
129:            {score === questions.length 
130:              ? 'F??licitations ! Vous avez r??pondu correctement ?? toutes les questions !' 
131:              : score > questions.length / 2 
132:                ? 'Bon travail ! Vous avez une bonne connaissance de la nutrition.'
133:                : 'Continuez ?? apprendre ! Vous pouvez faire mieux la prochaine fois.'}
134:          </p>
135:          <button
136:            onClick={restartQuiz}
137:            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg transition-colors"
138:          >
139:            Recommencer le quiz
140:          </button>
141:        </div>
142:      </div>
143:    );
144:  }
145:
146:  const renderQuestion = () => {
147:    const question = questions[currentQuestion];
148:    
149:    if (question.type === 'objective' || question.type === 'activity') {
150:      return (
151:        <div className="space-y-4 mb-8">
152:          {question.description && (
153:            <p className="text-gray-500 text-center mb-6">{question.description}</p>
154:          )}
155:          {question.options.map((option, index) => (
156:            <div 
157:              key={index}
158:              onClick={() => handleOptionSelect(index)}
159:              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
160:                selectedOption === index 
161:                  ? 'border-green-500 bg-green-50 shadow-sm' 
162:                  : 'border-gray-200 hover:border-green-300'
163:              }`}
164:            >
165:              <div className="flex items-center">
166:                <div className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center mr-3 transition-colors ${
167:                  selectedOption === index 
168:                    ? 'border-green-500 bg-green-500' 
169:                    : 'border-gray-300'
170:                }`}>
171:                  {selectedOption === index && (
172:                    <Check className="w-4 h-4 text-white" />
173:                  )}
174:                </div>
175:                <span className="text-gray-800">{option}</span>
176:              </div>
177:            </div>
178:          ))}
179:        </div>
180:      );
181:    } else if (question.inputType === 'number') {
182:      return (
183:        <div className="mb-8">
184:          {question.description && (
185:            <p className="text-gray-500 text-center mb-6">{question.description}</p>
186:          )}
187:          <div className="relative max-w-xs mx-auto">
188:            <input
189:              type="number"
190:              value={selectedOption || ''}
191:              onChange={(e) => handleOptionSelect(e.target.value)}
192:              className="w-full p-4 text-3xl text-center border-b-2 border-gray-300 focus:border-green-500 outline-none bg-transparent"
193:              placeholder={question.placeholder}
194:              min={question.min}
195:              max={question.max}
196:              step={question.type === 'age' ? '1' : '0.1'}
197:            />
198:            <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg">
199:              {question.unit || ''}
200:            </span>
201:          </div>
202:          <div className="flex justify-between mt-2 text-sm text-gray-400">
203:            <span>{question.min}+</span>
204:            <span>max {question.max}</span>
205:          </div>
206:        </div>
207:      );
208:    }
209:    
210:    return null;
211:  };
212:
213:  const renderResults = () => {
214:    const results = calculateResults();
215:    const objective = questions[0].options[answers[0]] || "Votre objectif";
216:    const activity = questions[4].options[answers[4]] || "Votre niveau d'activit??";
217:    
218:    return (
219:      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
220:        <div className="max-w-3xl mx-auto">
221:          <div className="text-center mb-10">
222:            <h1 className="text-3xl font-bold text-gray-900 mb-2">Votre plan personnalis??</h1>
223:            <p className="text-gray-600">Bas?? sur vos r??ponses, voici nos recommandations</p>
224:          </div>
225:
226:          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
227:            <div className="p-8">
228:              <div className="text-center mb-8">
229:                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
230:                  <Check className="w-12 h-12 text-green-600" />
231:                </div>
232:                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Profil complet</h2>
233:                <p className="text-gray-600">
234:                  Voici vos recommandations personnalis??es
235:                </p>
236:              </div>
237:
238:              <div className="space-y-6 mb-10">
239:                <div className="bg-green-50 p-6 rounded-xl">
240:                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Vos objectifs</h3>
241:                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
242:                    <div className="bg-white p-4 rounded-lg shadow-sm">
243:                      <p className="text-sm text-gray-500">Objectif principal</p>
244:                      <p className="font-medium">{objective}</p>
245:                    </div>
246:                    <div className="bg-white p-4 rounded-lg shadow-sm">
247:                      <p className="text-sm text-gray-500">Niveau d'activit??</p>
248:                      <p className="font-medium">{activity}</p>
249:                    </div>
250:                  </div>
251:                </div>
252:
253:                <div className="bg-blue-50 p-6 rounded-xl">
254:                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Vos besoins nutritionnels</h3>
255:                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
256:                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
257:                      <p className="text-sm text-gray-500">Calories quotidiennes</p>
258:                      <p className="text-2xl font-bold text-blue-600">{results.goalCalories}</p>
259:                      <p className="text-xs text-gray-500">{results.goalDescription}</p>
260:                    </div>
261:                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
262:                      <p className="text-sm text-gray-500">Prot??ines (quotidien)</p>
263:                      <p className="text-2xl font-bold text-blue-600">{results.proteinGrams}g</p>
264:                      <p className="text-xs text-gray-500">Recommand?? pour votre poids</p>
265:                    </div>
266:                    <div className="bg-white p-4 rounded-lg shadow-sm text-center">
267:                      <p className="text-sm text-gray-500">Eau (quotidien)</p>
268:                      <p className="text-2xl font-bold text-blue-600">{results.waterIntake}ml</p>
269:                      <p className="text-xs text-gray-500">Soit {Math.round(results.waterIntake / 250)} verres</p>
270:                    </div>
271:                  </div>
272:                </div>
273:                
274:                <div className="bg-yellow-50 p-6 rounded-xl">
275:                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Votre IMC</h3>
276:                  <div className="text-center">
277:                    <div className="inline-flex items-baseline">
278:                      <span className="text-4xl font-bold text-yellow-600">{results.bmi}</span>
279:                      <span className="ml-2 text-gray-500">kg/m??</span>
280:                    </div>
281:                    <p className="text-sm text-gray-600 mt-2">
282:                      {results.bmi < 18.5 ? 'Poids insuffisant' : 
283:                       results.bmi < 25 ? 'Poids normal' :
284:                       results.bmi < 30 ? 'Surpoids' : 'Ob??sit??'}
285:                    </p>
286:                  </div>
287:                </div>
288:              </div>
289:
290:              <div className="mt-10 text-center">
291:                <button
292:                  onClick={() => router.push('/')}
293:                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-colors flex items-center mx-auto"
294:                >
295:                  Commencer mon parcours
296:                  <ArrowRight className="ml-2 w-5 h-5" />
297:                </button>
298:                
299:                <button
300:                  onClick={restartQuiz}
301:                  className="mt-4 text-sm text-gray-600 hover:text-gray-800 flex items-center mx-auto"
302:                >
303:                  <ArrowLeft className="mr-1 w-4 h-4" />
304:                  Modifier mes r??ponses
305:                </button>
306:              </div>
307:            </div>
308:          </div>
309:        </div>
310:      </div>
311:    );
312:  };
313:
314:  if (showResult) {
315:    return renderResults();
316:  }
317:
318:  // Show loading state if submitting
319:  if (isSubmitting) {
320:    return (
321:      <div className="min-h-screen flex items-center justify-center bg-gray-50">
322:        <div className="text-center">
323:          <div className="w-16 h-16 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
324:          <p className="text-gray-600">Cr??ation de votre plan personnalis??...</p>
325:        </div>
326:      </div>
327:    );
328:  }
329:
330:  // Render the quiz UI
331:  return (
332:    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
333:      <Head>
334:        <title>Profil | RASHAQA</title>
335:        <meta name="description" content="Cr??ez votre profil personnalis??" />
336:      </Head>
337:
338:      <div className="max-w-2xl mx-auto">
339:        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
340:          <div className="p-6 sm:p-8">
341:            <div className="mb-8">
342:              <div className="w-full bg-gray-200 rounded-full h-2">
343:                <div 
344:                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
345:                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
346:                ></div>
347:              </div>
348:              <div className="flex justify-between mt-2 text-sm text-gray-500">
349:                <span>??tape {currentQuestion + 1} sur {questions.length}</span>
350:              </div>
351:            </div>
352:
353:            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
354:              {questions[currentQuestion].question}
355:            </h2>
356:
357:            {renderQuestion()}
358:            
359:            {error && (
360:              <div className="text-red-500 text-sm text-center mb-4">
361:                {error}
362:              </div>
363:            )}
364:
365:            <div className="flex justify-between items-center mt-10">
366:              <button
367:                onClick={handlePrev}
368:                disabled={currentQuestion === 0}
369:                className={`px-6 py-2 rounded-full font-medium ${
370:                  currentQuestion > 0 
371:                    ? 'text-gray-600 hover:bg-gray-100' 
372:                    : 'text-gray-300 cursor-not-allowed'
373:                }`}
374:              >
375:                ??? Pr??c??dent
376:              </button>
377:              
378:              <button
379:                onClick={handleNext}
380:                disabled={isSubmitting || selectedOption === null || selectedOption === ''}
381:                className={`px-6 py-3 rounded-full font-medium flex items-center ${
382:                  !isSubmitting && selectedOption !== null && selectedOption !== ''
383:                    ? 'bg-green-600 hover:bg-green-700 text-white'
384:                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
385:                } transition-colors`}
386:              >
387:                {isSubmitting ? (
388:                  'Chargement...'
389:                ) : currentQuestion === questions.length - 1 ? (
390:                  'Voir mes r??sultats'
391:                ) : (
392:                  'Suivant'
393:                )}
394:                {!isSubmitting && currentQuestion < questions.length - 1 && (
395:                  <ChevronRight className="ml-1 w-5 h-5" />
396:                )}
397:              </button>
398:            </div>
399:          </div>
400:        </div>
401:      </div>
402:    </div>
403:  );
404:}
