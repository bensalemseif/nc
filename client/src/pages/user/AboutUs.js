import { useAbout } from "../../contexts/AboutProvider";
import Spinner from "../../components/Spinner";
const AboutUs = () => {
  const { aboutData, loading, error } = useAbout();

  if (loading)   return (
    <div className="flex justify-center items-center min-h-screen">
      <Spinner />
    </div>
  );
  if (error) return <div>Error loading data...</div>;
  if (!aboutData) return <div>No data available</div>;

  return (
<div className="bg-gray-100">
  {/* About Us Section */}
  <div className="flex flex-col">
    <section className="relative w-full py-12 md:py-24 lg:py-32 bg-black">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url(${aboutData.imagePath})`,
        }}
      />
      <div className="relative container mx-auto px-4 md:px-6 text-center">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-white"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {aboutData.companyName}
        </h1>
      </div>
    </section>

    {/* What is NECTAR Section */}
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 grid gap-10 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 text-center">
            What is {aboutData.companyName}?
          </h2>
          <p className="text-lg text-gray-600 md:text-xl">
            {aboutData.factoryInfo.description}
          </p>
        </div>
        <div className="flex justify-center">
          <img
            src={`${aboutData.imagePath}`}
            alt="Factory Presentation"
            className="rounded-lg shadow-lg object-cover w-full max-w-xs md:max-w-full"
          />
        </div>
      </div>
    </section>

    {/* Key Features Section */}
    <section className="w-full py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
            Key Features of {aboutData.companyName}
          </h2>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {aboutData.keyFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center space-y-6 bg-white p-8 rounded-lg shadow-lg"
            >
              <h3 className="text-lg md:text-xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Visit and Get in Touch Section */}
    <section className="w-full py-16 lg:py-24 bg-gray-50 border-t">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 grid gap-12 md:grid-cols-2">
        <div className="space-y-6 text-center md:text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
            Visit {aboutData.companyName}
          </h2>
          <p className="text-lg text-gray-600 md:text-xl">
            Our factory is located at:
          </p>
          <address className="not-italic text-lg text-gray-600 md:text-xl">
            {aboutData.visitInfo.address}
            <br />
            <a
              href={`tel:${aboutData.visitInfo.phone}`}
              className="text-blue-600 hover:underline"
            >
              {aboutData.visitInfo.phone}
            </a>
          </address>
          <div className="h-64 sm:h-72 w-full overflow-hidden rounded-lg shadow-lg">
            <iframe
              src={aboutData.visitInfo.mapEmbedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
              className="rounded-lg"
            ></iframe>
          </div>
        </div>
        <div className="space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 text-center">
            Get in Touch
          </h2>
          <p className="text-lg text-gray-600 md:text-xl text-center">
            {aboutData.contactFormText}
          </p>
          <form className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Name"
                className="w-full rounded-lg border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full rounded-lg border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <input
              type="tel"
              placeholder="Phone Number (optional)"
              className="w-full rounded-lg border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Company Name (optional)"
              className="w-full rounded-lg border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
            />
            <textarea
              placeholder="Message"
              rows={4}
              className="w-full rounded-lg border-gray-300 p-3 focus:border-blue-500 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 p-3 text-white font-semibold hover:bg-blue-700"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</div>

  );
};

export default AboutUs;
