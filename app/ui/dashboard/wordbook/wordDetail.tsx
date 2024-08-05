import React from "react";

interface WordDetailProps {
  exampleSentences: string[];
  detailedDescription: string;
  nounPlural?: string | null;
  verbConjugations?: string | null;
}

const WordDetail: React.FC<WordDetailProps> = ({
  exampleSentences,
  detailedDescription,
  nounPlural,
  verbConjugations,
}) => {
  const [
    presentParticiple,
    pastTense,
    pastParticiple,
    thirdPersonSingularPresent,
  ] = verbConjugations
    ? verbConjugations.split(", ")
    : [null, null, null, null];

  return (
    <div className="p-6 bg-gray-100 rounded-md shadow-lg">
      {(nounPlural || verbConjugations) && (
        <div className="flex mb-4 space-x-6">
          {verbConjugations && (
            <div className="flex-1">
              <h2 className="text-xl font-bold">Verb Conjugations</h2>
              <ul className="list-disc list-inside pl-5 text-lg">
                <li>
                  <span className="font-semibold">Present Participle:</span>{" "}
                  {presentParticiple}
                </li>
                <li>
                  <span className="font-semibold">Past Tense:</span> {pastTense}
                </li>
                <li>
                  <span className="font-semibold">Past Participle:</span>{" "}
                  {pastParticiple}
                </li>
                <li>
                  <span className="font-semibold">
                    Third Person Singular Present:
                  </span>{" "}
                  {thirdPersonSingularPresent}
                </li>
              </ul>
            </div>
          )}
          {nounPlural && (
            <div className="flex-1">
              <h2 className="text-xl font-bold">Noun Plural Form</h2>
              <p className="text-lg">{nounPlural}</p>
            </div>
          )}
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-xl font-bold">Detailed Description</h2>
        <p className="text-lg">{detailedDescription}</p>
      </div>

      <div>
        <h2 className="text-xl font-bold">Example Sentences</h2>
        <ul className="list-disc list-inside pl-5 text-lg">
          {exampleSentences.map((sentence, index) => (
            <li key={index} className="mb-1">
              {sentence}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WordDetail;
