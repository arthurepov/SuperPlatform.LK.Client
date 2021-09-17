using System;

namespace SuperPlatform.LK.Client.Extensions
{
    public static class DayOfWeekExtensions
    {
        public static int GetNumberValue(this DayOfWeek dayOfWeek)
        {
            if (dayOfWeek == DayOfWeek.Sunday)
            {
                return 6;
            }
            else
            {
                return (int)dayOfWeek - 1;
            }
        }

        public static DayOfWeek GetDayOfWeek(int number)
        {
            if (number == 6)
            {
                return DayOfWeek.Sunday;
            }
            else
            {
                return (DayOfWeek)(number + 1);
            }
        }
    }
}
