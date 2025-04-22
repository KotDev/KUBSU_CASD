public interface Cars: Transport
{
    string carName: {get; }
    string model: {get; }
    int year: {get; }
    void info();
}

public interface Transport
{
    double getMaxSpeed();
    void move()
}

public class Car: Cars
{
    public string carName: {get; }
    public string model: {get; }
    public int year: {get; }

    public Car(string carName, string model, int year)
    {
        carName = carName;
        model = model;
        year = year;
    }

    public void info();
    public double getMaxSpeed() => 220;
    public void move();
}