import ascii from "../ascii.txt";

// https://www.asciiart.eu/text-to-ascii-art
// https://patorjk.com/software/taag/#p=display&f=Rectangles&t=P+R+A+J+W+A+L%0A++W+e+l+c+o+m+e+s%0A+++++++++Y+O+U&x=none&v=4&h=4&w=80&we=false
const WelcomeAscii = () => {
  return (
    <div>
      <pre className="text-left">{ascii}</pre>
      <br />
      <p className="text-sm lg:text-xl">
        Welcome to my portfolio <br /> A terminal-style navigation experience
      </p>
      <br />
      <p className="text-sm lg:text-xl">
        I’m a software engineer and developer with a passion for building
        scalable systems, experimenting with new technologies, and sharing what
        I learn along the way.
      </p>
    </div>
  );
};

export default WelcomeAscii;
