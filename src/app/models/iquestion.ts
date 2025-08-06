export interface IChoice {
  choiceText: string;
  isCorrect: boolean;
}

export interface IQuestion {
  questionText: string;
  questionType: 'MCQ' | 'TF' | 'Text';
  choices?: IChoice[];
  tfCorrectAnswer?: boolean;
}
