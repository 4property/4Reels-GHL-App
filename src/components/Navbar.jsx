function Navbar({ currentStep, onNext, onPrevious }) {
  return (
    <nav>
      <button
        className="rounded-full bg-blue-950 text-white px-4 py-2"
        onClick={onPrevious}
      >
        Previous
      </button>
      <button
        className="rounded-full bg-blue-950 text-white px-4 py-2"
        onClick={onNext}
      >
        Next
      </button>
    </nav>
  );
}

export { Navbar };
